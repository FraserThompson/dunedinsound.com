---
title: Blog
permalink: "/blog/"
layout: default-container
order: 4
---

<div id="blog" >
    <div class="container-fluid">
        <div class="row">
            <div class="col-xs-12 col-sm-8">
                <div class="row">
                {% for post in site.blog_posts %}
                    <a href="{{ post.url | prepend: site.baseurl }}">
                        <h1>{{post.title}}</h1>
                    </a>
                {% endfor %}
                </div>
            </div>
        </div>
    </div>
</div>
