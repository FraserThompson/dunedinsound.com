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
                {% assign content = site.posts | concat: site.blog_posts | sort: 'date' | reverse %}
                {% for tile in site.posts limit: 1 %}

                    {% assign type = tile.url | split: '/' %}

                    {% include gig_tile.html class="feature" sizing="col-xs-12" category="home" %}
                    
                {% endfor %}
            </div>
        </div>
        <div class="col-xs-12 col-sm-4" id="more" style="background-color: black;">
            <span class="label label-default hidden-xs ">RECENT POSTS</span>
            <div class="row sorted-tiles">
                {% assign count = 0 %}
                {% for tile in content limit: 4 %}
                    {% assign type = tile.url | split: '/' %}
                    {% if count == 3 %}
                        {% break %}
                    {% endif %}
                    {% if type[1] == "gigs" %}
                        {% unless forloop.first %}
                            {% assign title = tile.title | prepend: "GIG: " %}
                            {% assign count = count | plus: 1 %}
                            {% include gig_tile.html class="bottom thinner" sizing="col-xs-12" category="home" title=title %}
                        {% endunless %}
                    {% elsif type[1] == "blog" %}
                        {% assign title = tile.title | prepend: "BLOG: " %}
                        {% assign count = count | plus: 1 %}
                        {% include gig_tile.html class="bottom thinner" sizing="col-xs-12" category="home" image=tile.image title=title %}
                    {% endif %}

                {% endfor %}
            </div>
        </div>
</div>
