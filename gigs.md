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
---

<div class="tiles container-fluid gigs">

  {% assign year_change = true %}

  {% include gig_sorting.html %}

  <div class="row sorted-tiles">
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

        {% include gig_tile.html class="bottom thinner full-width" id=id sizing="col-xs-12" category="gigs" %}

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
