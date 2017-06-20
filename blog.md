---
title: Blog
permalink: "/blog/"
layout: blog
type: blog
order: 4
---

<div class="row">
    {% for post in site.blog_posts %}
        <div class="col-xs-12">
            <a href="{{ post.url | prepend: site.baseurl }}">
                <h1>{{post.title}}</h1>
            </a>
                <h3>By {{post.author}} on {{post.date | date_to_long_string}}
                    {% for tag in post.tags %}
                        <small class="label label-blog">{{tag}}</small>
                    {% endfor %}
                </h3>
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