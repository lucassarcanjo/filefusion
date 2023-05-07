terraform {
  required_providers {
    azurerm = {
      source = "hashicorp/azurerm"
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
  name = "filefusion"
  location = "eastus2"
}

// Monitoring and Telemetry
resource "azurerm_log_analytics_workspace" "aiWorkspace" {
  name = "filefusion-ai-workspace"
  location = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  sku = "PerGB2018"
  retention_in_days = 30
}

resource "azurerm_application_insights" "ai" {
  name = "filefusion-ai"
  location = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  workspace_id = azurerm_log_analytics_workspace.aiWorkspace.id
  application_type = "web"
}

// Storage
resource "azurerm_storage_account" "sa" {
  name = "filefusionstorage"
  resource_group_name = azurerm_resource_group.rg.name
  location = azurerm_resource_group.rg.location
  account_tier = "Standard"
  account_replication_type = "LRS"
}

// Function App
resource "azurerm_service_plan" "plan" {
  name = "filefusion-app-plan"
  location = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  os_type = "Linux"
  sku_name = "Y1"
}

resource "azurerm_linux_function_app" "app" {
  name = "filefusion-function"
  location = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  storage_account_name = azurerm_storage_account.sa.name
  storage_account_access_key = azurerm_storage_account.sa.primary_access_key
  service_plan_id = azurerm_service_plan.plan.id

  site_config {
    application_insights_connection_string = azurerm_application_insights.ai.connection_string
    application_insights_key = azurerm_application_insights.ai.instrumentation_key
    http2_enabled = true

    application_stack {
      node_version = 18
    }
  }
}