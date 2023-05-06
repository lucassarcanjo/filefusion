terraform {
  required_providers {
    azurerm = {
      source = "hashicorp/azurerm"
      version = "~> 3.0.2"
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
