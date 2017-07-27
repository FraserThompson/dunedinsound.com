---
title: Home
permalink: "/"
layout: default
colors: 
    - "#212121"
    - "#141414"
    - "#292929"
    - "#0A0A0A"
description: "Check out rare and unofficial photos, bootlegs and videos of gigs in Dunedin from 2014 until now!"
order: 1
---

<div id="gigs" >
    <div class="container-fluid gigs">
        <div class="row">
            <div class="col-xs-12 col-sm-8">
                <div class="row sorted-tiles">
                {% for tile in site.posts limit: 1 %}

                    {% assign type = tile.url | split: '/' %}

                    {% include gig_tile.html class="feature" sizing="col-xs-12" category="home" %}
                    
                {% endfor %}
            </div>
        </div>
        <div class="col-xs-12 col-sm-4" id="more" style="background-color: black;">
            <span class="label label-default hidden-xs ">RECENT GIGS</span>
            <div class="row sorted-tiles">
                {% for tile in site.posts limit: 4 %}
                    {% assign type = tile.url | split: '/' %}

                    {% unless forloop.first %}
                        {% include gig_tile.html class="bottom thinner" sizing="col-xs-12" category="home" %}
                    {% endunless %}
                {% endfor %}
                <a title="More" href="/gigs" class="link"><div class="col-xs-12 divider purple link">
                    <h5>More gigs</h5>
                </div></a>
            </div>
        </div>
</div>
