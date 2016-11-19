---
title: Get
permalink: "/get/"
layout: default
menu: false
---

<div class="container-fluid">
	<div class="row">
	{% for file in site.static_files %}
		{% if file.path contains "/assets/mp3/" %}
			{% assign index = forloop.index0 %}
			<div class="col-xs-12">
				<div id="waveform{{index}}" class="waveforms" data-mp3="{{file.path}}"></div>
			</div>
		{% endif %}
	{% endfor %}
	</div>
</div>