---
title: Gigs
permalink: "/gigs/"
layout: default
searchable: true
colors: 
    - "#212121"
    - "#141414"
    - "#292929"
    - "#0A0A0A"
order: 1
double_header: true
sidebar: true
description: "Check out rare and unofficial photos, videos and bootlegs of gigs in Dunedin, New Zealand from 2014 until now!"
---

{% assign year_change = true %}

  {% include gig_sorting.html %}
<div class="tiles container-fluid gigs">
  <div class="sorted-tiles row">
    <div class="col-xs-12">
    {% for tile in site.posts %}

      {% assign type = tile.url | split: '/' %}

        {% assign machine_name = tile.title | downcase | machine_name %}

        {% capture this_year %}{{ tile.date | date: "%Y" }}{% endcapture %}
        {% capture this_month %}{{ tile.date | date: "%B" }}{% endcapture %}
        {% capture next_year %}{{ tile.previous.date | date: "%Y" }}{% endcapture %}
        {% capture next_month %}{{ tile.previous.date | date: "%B" }}{% endcapture %}

        {% if forloop.first %}
          {% capture id %}{{this_month}}{{this_year}}{% endcapture %}
        {% endif %}

        {% if year_change %}
          <div class="row" id="y{{this_year}}">
          {% assign year_change = false %}
        {% endif %}

        {% include gig_tile.html class="bottom eventhinner full-width" id=id sizing="col-xs-12" category="gigs" month=this_month year=this_year image_size="Medium" image_class="blur" %}

        {% assign id = false %}

        {% if forloop.last != true and this_year != next_year %}
            </div>
            {% assign year_change = true %}
            {% capture id %}{{next_month}}{{next_year}}{% endcapture %}
        {% elsif forloop.last != true and this_month != next_month %}
            {% capture id %}{{next_month}}{{this_year}}{% endcapture %}
        {% endif %}

    {% endfor %}
    </div>
  </div>
</div>

{% include back_to_top.html %}