resource "cloudflare_worker_script" "spainter_script" {
  name = "spainter"
  account_id = var.cloud_flare_account_id
  content = file("./cloudflareworker.js")
  module = true
  plain_text_binding {
    name = "html"
    text = file("./index.html")
  }
}


resource "cloudflare_worker_domain" "spainter_domain" {
  account_id = var.cloud_flare_account_id
  hostname   = var.domain_name
  service    = cloudflare_worker_script.spainter_script.name
  zone_id    = var.cloud_flare_zone_id
}


resource "cloudflare_worker_route" "catch_all_route" {
  zone_id = var.cloud_flare_zone_id
  pattern = "${var.domain_name}/*"
  script_name = cloudflare_worker_script.spainter_script.name
}