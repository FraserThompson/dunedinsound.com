---
title: Gigs
permalink: "/"
layout: default
colors: 
    - "#212121"
    - "#141414"
    - "#292929"
    - "#0A0A0A"
order: 1
---

<div class="cover-the-top" id="gigs" >
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
        <div class="col-xs-12 col-sm-4">
            <div class="row sorted-tiles">
                {% for tile in site.posts limit: 4 %}

                    {% assign type = tile.url | split: '/' %}
                    {% assign class = "bottom thinner" %}

                    {% unless forloop.first %}
                        {% include gig_tile.html %}
                    {% endunless %}
                {% endfor %}
            </div>
        </div>
        <div class="col-xs-12" id="more">
            <div class="row sorted-tiles no-margin">
                <div class="row year-container">
                    <div class="col-xs-12">
                        <div class="row year-title" style="padding-left: 15px; padding-right: 15px;">
                            <h2>{{site.posts[4].date  | date: "%Y"}}</h2>
                        </div>
                        <div class="row month-container" style="padding-left: 15px; padding-right: 15px; background-color: {% cycle "#212121", "#141414" %}">
                            <div class="col-xs-12 month-title">
                                <h3>{{site.posts[4].date | date: "%B"}}</h3>
                            </div>
                            <div class="col-xs-12">
                {% for tile in site.posts %}

                    {% assign type = tile.url | split: '/' %}
                    {% assign class = "bottom" %}
                    {% assign sizing = "col-xs-6 col-md-4 col-lg-3" %}

                    {% unless forloop.index < 5 %}
                    
                        {% capture this_year %}{{ tile.date | date: "%Y" }}{% endcapture %}
                        {% capture this_month %}{{ tile.date | date: "%B" }}{% endcapture %}
                        {% capture next_year %}{{ tile.previous.date | date: "%Y" }}{% endcapture %}
                        {% capture next_month %}{{ tile.previous.date | date: "%B" }}{% endcapture %}

                        {% include gig_tile.html %}

                        {% if next_year != this_year %}
                            </div>
                            </div>
                            </div>
                            </div>
                            <div class="row year-container">
                                <div class="col-xs-12">
                                    <div class="row year-title" style="padding-left: 15px; padding-right: 15px;">
                                        <h2>{{ next_year }}</h2>
                                    </div>
                                    <div class="row month-container" style="padding-left: 15px; padding-right: 15px; background-color: {% cycle "#212121", "#141414" %}">
                                        <div class="col-xs-12 month-title">
                                            <h3>{{ next_month }}</h3>
                                        </div>
                                        <div class="col-xs-12">
                        {% else %}
                            {% if next_month != this_month %}
                                </div>
                                </div>
                                <div class="row month-container" style="padding-left: 15px; padding-right: 15px; background-color: {% cycle "#212121", "#141414" %}">
                                    <div class="col-xs-12">
                                        <h3>{{ next_month }}</h3>
                                    </div>
                                    <div class="col-xs-12">
                            {% endif %}
                        {% endif %}

                    {% endunless %}

                {% endfor %}
            </div>
        </div> 
    </div>
</div>
