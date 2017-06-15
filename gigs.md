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

  {% assign sizing = "col-xs-12" %}
  {% assign class = "bottom thinner full-width" %}

  {% include gig_sorting.html %}

  <div class="row sorted-tiles" id="y{{ site.time | date: '%Y' }}">
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

        {% include gig_tile.html %}

        {% if year_change %}
          {% capture id %}{{this_month}}{{this_year}}{% endcapture %}
        {% else %}
          {% capture id %}{% endcapture %}
        {% endif %}

        {% assign year_change = false %}

        {% if forloop.last != true and this_year != next_year %}

            {% assign year_change = true %}
            {% capture id %}y{{next_year}}{% endcapture %}

        {% else %}    
            {% if forloop.last != true and this_month != next_month %}

              {% capture id %}{{next_month}}{{this_year}}{% endcapture %}

            {% endif %}
        {% endif %}

    {% endfor %}
  </div>
</div>
