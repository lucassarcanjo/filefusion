terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.55.0"
    }
  }

  required_version = ">= 1.1.0"
}

provider "azurerm" {
  features {}
}

// Resource Group
resource "azurerm_resource_group" "rg" {
  name     = "filefusion"
  location = "eastus2"
}

// Monitoring and Telemetry
resource "azurerm_log_analytics_workspace" "aiWorkspace" {
  name                = "filefusion-ai-workspace"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  sku                 = "PerGB2018"
  retention_in_days   = 30
}

resource "azurerm_application_insights" "ai" {
  name                = "filefusion-ai"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  workspace_id        = azurerm_log_analytics_workspace.aiWorkspace.id
  application_type    = "web"
}

// Storage
resource "azurerm_storage_account" "sa" {
  name                     = "filefusionstorage"
  resource_group_name      = azurerm_resource_group.rg.name
  location                 = azurerm_resource_group.rg.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
}

resource "azurerm_storage_container" "sc" {
  name                  = "app-files"
  storage_account_name  = azurerm_storage_account.sa.name
  container_access_type = "blob"
}

// Function App
resource "azurerm_service_plan" "plan" {
  name                = "filefusion-app-plan"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  os_type             = "Linux"
  sku_name            = "Y1"
}

resource "azurerm_linux_function_app" "app" {
  name                       = "filefusion-function"
  location                   = azurerm_resource_group.rg.location
  resource_group_name        = azurerm_resource_group.rg.name
  storage_account_name       = azurerm_storage_account.sa.name
  storage_account_access_key = azurerm_storage_account.sa.primary_access_key
  service_plan_id            = azurerm_service_plan.plan.id

  site_config {
    application_insights_connection_string = azurerm_application_insights.ai.connection_string
    application_insights_key               = azurerm_application_insights.ai.instrumentation_key

    application_stack {
      node_version = 18
    }
  }

  app_settings = {
    CosmosDbConnectionString                 = azurerm_cosmosdb_account.cosmos.connection_strings[0]
    WEBSITE_CONTENTAZUREFILECONNECTIONSTRING = azurerm_storage_account.sa.primary_connection_string
  }

  tags = {
    "hidden-link: /app-insights-conn-string"         = azurerm_application_insights.ai.connection_string
    "hidden-link: /app-insights-instrumentation-key" = azurerm_application_insights.ai.instrumentation_key
    "hidden-link: /app-insights-resource-id"         = replace(lower(azurerm_application_insights.ai.id), "resourcegroups", "resourceGroups")
  }
}

// Cosmos Database
resource "azurerm_cosmosdb_account" "cosmos" {
  name                      = "filefusion-cosmos"
  location                  = azurerm_resource_group.rg.location
  resource_group_name       = azurerm_resource_group.rg.name
  offer_type                = "Standard"
  kind                      = "GlobalDocumentDB"
  enable_automatic_failover = false
  enable_free_tier          = true
  geo_location {
    location          = azurerm_resource_group.rg.location
    failover_priority = 0
  }
  consistency_policy {
    consistency_level       = "BoundedStaleness"
    max_interval_in_seconds = 300
    max_staleness_prefix    = 100000
  }
}

resource "azurerm_cosmosdb_sql_database" "db" {
  name                = "db"
  resource_group_name = azurerm_resource_group.rg.name
  account_name        = azurerm_cosmosdb_account.cosmos.name
}

resource "azurerm_cosmosdb_sql_container" "container" {
  name                  = "actions"
  resource_group_name   = azurerm_resource_group.rg.name
  account_name          = azurerm_cosmosdb_account.cosmos.name
  database_name         = azurerm_cosmosdb_sql_database.db.name
  partition_key_path    = "/definition/id"
  partition_key_version = 1
}

// Azure Static Web App
resource "azurerm_static_site" "web" {
  name                = "filefusion-web"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
}

output "web_app_deployment_token" {
  value     = azurerm_static_site.web.api_key
  sensitive = true
}
