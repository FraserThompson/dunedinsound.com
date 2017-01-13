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

<div id="gigs" data-spy="scroll" data-target="#sorting-nav">
    <div class="gig-sorting nice-scrollbar" id="sorting-nav">
        <ul class="nav nav-custom nav-stacked" role="navigation">
        {% for post in site.posts  %}
            {% capture this_year %}{{ post.date | date: "%Y" }}{% endcapture %}
            {% capture this_month %}{{ post.date | date: "%B" }}{% endcapture %}
            {% capture next_year %}{{ post.previous.date | date: "%Y" }}{% endcapture %}
            {% capture next_month %}{{ post.previous.date | date: "%B" }}{% endcapture %}

            {% if forloop.first %}
            <li id="{{ this_year }}-ref" class="year"><a href="#{{this_year}}">{{this_year}}</a>
                <ul class="nav nav-custom nav-stacked">
                    <li id="{{ this_year }}-{{ this_month }}-ref"><a href="#{{this_year}}.{{this_month}}">{{ this_month }}</a></li>
            {% endif %}
            {% if forloop.last %}
            </ul>
            </li>
            {% else %}
                {% if this_year != next_year %}
                    </ul>
                    </li>
                    <li id="{{ next_year }}-ref" class="year"><a href="#{{next_year}}">{{next_year}}</a>
                        <ul class="nav nav-custom nav-stacked">
                        <li id="{{ next_year }}-{{ next_month }}-ref"><a href="#{{next_year}}.{{next_month}}">{{ next_month }}</a></li>
                {% else %}    
                    {% if this_month != next_month %}
                        <li id="{{ this_year }}-{{ next_month }}-ref"><a href="#{{next_year}}.{{next_month}}">{{ next_month }}</a></li>
                    {% endif %}
                {% endif %}
            {% endif %}
        {% endfor %}
        </ul>
    </div>

    <div class="container-fluid gigs">
        <div class="row sorted-tiles">
        {% for tile in site.posts %}
            {% capture this_year %}{{ tile.date | date: "%Y" }}{% endcapture %}
            {% capture this_month %}{{ tile.date | date: "%B" }}{% endcapture %}
            {% capture next_year %}{{ tile.previous.date | date: "%Y" }}{% endcapture %}
            {% capture next_month %}{{ tile.previous.date | date: "%B" }}{% endcapture %}

            {% assign type = tile.url | split: '/' %}

            {% if forloop.first %}
                {% assign class = "feature" %}
            {% else %}
                {% assign class = "" %}
            {% endif %}

            {% if forloop.first %}
            <div id="{{ this_year }}" class="col-xs-12">
                <div id="{{this_year}}.{{this_month}}" class="col-xs-12">
            {% endif %}

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
