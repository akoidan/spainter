variable "domain_name" {
  default = "spainter.akoidan.com"
  description = "site url"
  validation {
    condition     = can(regex("^.+$", var.domain_name))
    error_message = "domain_name is required"
  }
}

variable "cloud_flare_account_id" {
  description = "Copy Account id Zone Id from https://dash.cloudflare.com/"
  validation {
    condition     = can(regex("^.+$", var.cloud_flare_account_id))
    error_message = "accountId is required"
  }
  sensitive = true
}

variable "cloud_flare_zone_id" {
  description = "Copy API Zone Id from https://dash.cloudflare.com/"
  validation {
    condition     = can(regex("^.+$", var.cloud_flare_zone_id))
    error_message = "cloud_flare_zone_id is required"
  }
  sensitive = true
}
variable "cloud_flare_api_token" {
  description = <<EOT
    Go to https://dash.cloudflare.com/profile/api-tokens.
    Create a new token with set of permissions
    Account - Worker Scripts - Edit
    Zone    - DNS - Edit
    Zone    - Worker Routes - Edit
  EOT
  validation {
    condition     = can(regex("^.+$", var.cloud_flare_api_token))
    error_message = "cloud_flare_api_token is required"
  }
  sensitive = true
}

