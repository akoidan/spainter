terraform {
  required_providers {
    cloudflare = {
      source = "cloudflare/cloudflare"
      version = "4.7.1"
    }
  }
}


provider "cloudflare" {
  api_token = var.cloud_flare_api_token
}