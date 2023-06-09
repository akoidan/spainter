resource "cloudflare_worker_script" "spainter_script" {
  name = "spainter"
  account_id = var.cloud_flare_account_id
  content = file("./cloudflare-worker.js")
  module = true

  # this is required to enable formData to return arrayBufferInstead of strings
  compatibility_date = "2023-06-08"
  plain_text_binding {
    name = "html"
    text = file("./index.html")
  }

  plain_text_binding {
    name = "imgUrl"
    text = "https://${var.img_domain_name}/"
  }

  r2_bucket_binding {
    name        = "spainter"
    bucket_name = cloudflare_r2_bucket.spainter.name
  }

}

## Add a page rule to the domain
# should be done manually
#resource "cloudflare_page_rule" "spainter_redirect" {
#  zone_id = var.cloud_flare_zone_id
#  target = "${var.domain_name}/*"
#  priority = 1
#
#  actions {
#    status_code = 301
#    url = "https://${var.domain_name}"
#  }
#}

resource "cloudflare_worker_domain" "spainter_domain" {
  account_id = var.cloud_flare_account_id
  hostname   = var.domain_name
  service    = cloudflare_worker_script.spainter_script.name
  zone_id    = var.cloud_flare_zone_id
}

resource "cloudflare_r2_bucket" "spainter" {
  account_id = var.cloud_flare_account_id
  name       = "spainter"
}

resource "cloudflare_worker_route" "catch_all_route" {
  zone_id = var.cloud_flare_zone_id
  pattern = "${var.domain_name}/*"
  script_name = cloudflare_worker_script.spainter_script.name
}
