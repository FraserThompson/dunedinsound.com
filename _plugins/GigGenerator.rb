module GigGenerator
  class Generator < Jekyll::Generator
    def generate(site)
      @site = site

      asset_url = site.config['asset_url']
      if asset_url.nil?
        asset_url = ""
      end

      site.posts.docs.each do |post|

        bands = post.data['media']
        unless post.data['image']
          post.data['image'] = "/assets/img/" + ERB::Util.url_encode(post.data['title']) + "/cover.jpg"
        end

        if bands
          bands.each do |band, data|
            # Generate band name and set band_name variable for convenience
            data['machine_name'] = machine_name(band)
            data['band_name'] = band

            # Generate the MP3 links
            mp3s = data['mp3']
            if mp3s
              mp3s.each do |mp3|
                if mp3['link']
                  mp3['generated_link'] = asset_url + "/assets/audio/" + mp3['link']
                elsif mp3['title']
                  mp3['generated_link'] = url_encode(asset_url + "/assets/audio/" + data['machine_name'] + "/" + post.data['title'] + " - " + data['band_name'] + ".mp3")
                end
              end

            end

          end
        end
      end

    end

    def machine_name(input)
      return input.to_s.downcase.gsub(Regexp.union({' ' => '_', ',' => '', '$' => 'z', '!' => '', '.' => '', "'" => '', "&" => "and", 'è' => 'e', '12' => 'twelve', '4' => 'four'}.keys), {' ' => '_', ',' => '', '$' => 'z', '!' => '', '.' => '', "'" => '', "&" => "and", 'è' => 'e', '12' => 'twelve', '4' => 'four'})
    end

    def url_encode(input)
      return URI.escape(input).to_s.gsub(Regexp.union({'#' => '%23', "'" => "%27"}.keys), {'#' => '%23', "'" => "%27"})
    end
  end
end