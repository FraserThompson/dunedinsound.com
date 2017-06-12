---
title: Gigs
permalink: "/gigs/"
layout: default-slim-header
searchable: true
colors: 
    - "#212121"
    - "#141414"
    - "#292929"
    - "#0A0A0A"
order: 1
---

<div class="tiles container-fluid gigs">

  {% assign sizing = "col-xs-6 col-md-4 col-lg-3" %}
  {% assign class = "bottom thinner full-width" %}

  {% include gig_sorting.html %}

  <div class="row sorted-tiles">
    {% for tile in site.posts %}

      {% assign type = tile.url | split: '/' %}

        {% assign machine_name = tile.title | downcase | machine_name %}

        {% assign tile_background = site.asset_url | append: "/assets/img/" | append: tile.title | url_encode | replace: '+', '%20' | replace: '%2F', '/' | append: "/cover.jpg" %}

        {% capture this_year %}{{ tile.date | date: "%Y" }}{% endcapture %}
        {% capture this_month %}{{ tile.date | date: "%B" }}{% endcapture %}
        {% capture next_year %}{{ tile.previous.date | date: "%Y" }}{% endcapture %}
        {% capture next_month %}{{ tile.previous.date | date: "%B" }}{% endcapture %}

        {% if forloop.first %}

          <div class="isotope-item col-xs-12 divider inverted" id="y{{this_year}}">
            <h3>{{this_year}}</h3>
          </div>
          <div class="isotope-item col-xs-12 divider" id="{{this_month}}{{this_year}}">
            <h4>{{this_month}}</h4>
          </div>

        {% endif %}

        {% include gig_tile.html %}

        {% if forloop.last != true and this_year != next_year %}

            <div class="isotope-item col-xs-12 divider inverted" id="y{{next_year}}">
              <h3>{{next_year}}</h3>
            </div>

            <div class="isotope-item col-xs-12 divider" id="{{next_month}}{{next_year}}">
              <h4>{{next_month}}</h4>
            </div>

        {% else %}    
            {% if forloop.last != true and this_month != next_month %}
            
              <div class="isotope-item col-xs-12 divider" id="{{next_month}}{{this_year}}">
                <h4>{{next_month}}</h4>
              </div>

            {% endif %}
        {% endif %}

    {% endfor %}
  </div>
</div>
