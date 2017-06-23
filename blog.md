---
title: Blog
permalink: "/blog/"
layout: default-container
type: blog
description: "Dunedinsound.com blog - What's going on in the Dunedin music scene, as well as photography, web development and other interesting (ish) articles."
order: 4
---

<div class="row">
    <div class="col-xs-12">
    <h1>Latest Posts</h1>
    </div>
    {% for post in site.blog_posts reversed%}
        <div class="col-xs-12">
            <a href="{{ post.url | prepend: site.baseurl }}">
                <h2>{{post.title}}</h2>
            </a>
            <h4>{{post.date | date_to_long_string}} by {{post.author}}</h4>
            <h5>
            {% for tag in post.tags %}
                <small class="label label-blog">{{tag}}</small>
            {% endfor %}
            </h5>
            <a href="{{ post.url | prepend: site.baseurl }}">
            {% if post.image %}
                <div style="width: 100%; height: 20vh; background-image: url('{{post.image}}'); background-size: cover; background-position: center;"></div>
            {% else %}
                <div class="pattern1" style="height: 20vh;"></div>
            {% endif %}
            </a>
            <p>{{ post.excerpt }}</p>
            <h3><a href="{{ post.url | prepend: site.baseurl }}"> Continue reading... </a></h3>
        </div>
        <div class="col-xs-12">
            <hr>
        </div>
    {% endfor %}
</div>