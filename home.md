---
title: Home
permalink: "/"
layout: default-slim-header
colors: 
    - "#212121"
    - "#141414"
    - "#292929"
    - "#0A0A0A"
order: 1
---

<div id="gigs" >
    <div class="container-fluid gigs">
        <div class="row">
            <div class="col-xs-12 col-sm-8">
                <div class="row sorted-tiles">
                {% for tile in site.posts limit: 1 %}

                    {% assign type = tile.url | split: '/' %}
                    {% assign class = "feature" %}
                    {% assign sizing = "col-xs-12" %}

                    {% include gig_tile.html %}
                    
                {% endfor %}
            </div>
        </div>
        <div class="col-xs-12 col-sm-4" id="more" style="background-color: black;">
            <span class="label label-default">RECENT GIGS</span>
            <div class="row sorted-tiles">
                {% for tile in site.posts limit: 4 %}
                    {% assign type = tile.url | split: '/' %}
                    {% assign class = "bottom thinner" %}
                    {% unless forloop.first %}
                        {% include gig_tile.html %}
                    {% endunless %}
                {% endfor %}
            </div>
            <a href="/gigs/" style="float:right;"><h5>older gigs</h5></a>
        </div>
</div>
