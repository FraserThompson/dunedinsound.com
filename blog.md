---
title: Blog
permalink: "/blog/"
layout: default-container
description: "Dunedinsound.com blog - What's going on in the Dunedin music scene and other interesting stuff."
background_color: white
order: 4
---

<div class="row">
    <div class="col-xs-12">
    <h1>Latest Posts</h1>
    </div>
    {% for post in site.blog_posts reversed%}
        <div class="col-xs-12">
            {% include blog_snippet.html %}
        </div>
        <div class="col-xs-12">
            <hr>
        </div>
    {% endfor %}
</div>