---
title: Blog
permalink: "/blog/"
layout: blog
order: 4
---

<div class="row">
    {% for post in site.blog_posts %}
        <div class="col-xs-12">
            <a href="{{ post.url | prepend: site.baseurl }}">
                <h1>{{post.title}}</h1>
                <h4>{{post.date | date_to_long_string}}</h4>
                {% for tag in post.tags %}
                    <small>{{tag}}</small>
                {% endfor %}
                <p>{{ post.excerpt }}</p>
            </a>
        </div>
    {% endfor %}
</div>