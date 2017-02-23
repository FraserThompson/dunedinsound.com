---
title: Gigs
permalink: "/"
layout: default
colors: 
    - "#212121"
    - "#141414"
    - "#292929"
    - "#292929"
    - "#0A0A0A"
order: 1
---

<div class="cover-the-top" id="gigs" data-spy="scroll" data-target="#sorting-nav">
    <div class="container-fluid gigs">
        <div class="row">
            <div class="col-xs-1">
                {% include gig_sorting.html %}
            </div>
            <div class="col-xs-8">
                <div class="row sorted-tiles">
                {% for tile in site.posts limit: 1 %}
                    {% capture this_year %}{{ tile.date | date: "%Y" }}{% endcapture %}
                    {% capture this_month %}{{ tile.date | date: "%B" }}{% endcapture %}

                    {% assign type = tile.url | split: '/' %}

                    {% assign class = "feature" %}

                    <div id="{{ this_year }}" class="col-xs-12">
                        <div id="{{this_year}}.{{this_month}}" class="col-xs-12">

                            {% include gig_tile.html %}

                        </div>
                    </div>
                {% endfor %}
            </div>
        </div>
        <div class="col-xs-3">
            <div class="row sorted-tiles">
                {% for tile in site.posts %}
                    {% capture this_year %}{{ tile.date | date: "%Y" }}{% endcapture %}
                    {% capture this_month %}{{ tile.date | date: "%B" }}{% endcapture %}
                    {% capture next_year %}{{ tile.previous.date | date: "%Y" }}{% endcapture %}
                    {% capture next_month %}{{ tile.previous.date | date: "%B" }}{% endcapture %}

                    {% assign type = tile.url | split: '/' %}
                    {% assign class = "" %}

                    {% unless forloop.first %}

                        {% include gig_tile.html %}

                        {% if forloop.last %}
                            </div>
                            </div>
                        {% else %}
                            {% if this_year != next_year %}
                                </div>
                                </div>
                                <div id="{{ next_year }}" class="col-xs-12">
                                    <div id="{{next_year}}.{{next_month}}" class="col-xs-12">
                                {% else %}
                                    {% if this_month != next_month %}
                                        </div>
                                        <div id="{{next_year}}.{{next_month}}" class="col-xs-12">
                                    {% endif %}
                                {% endif %}
                            {% endif %}
                    {% endunless %}
                {% endfor %}
                <div class="col-xs-12 tile-wrap even-darker disabled">
                    <a class="box gridItem">
                    <div class="tile-title">
                        <center><h1 class="name">The beginning of time</h1></center>
                    </div>
                    </a>
                </div>
            </div>
        </div> 
    </div>
</div>
