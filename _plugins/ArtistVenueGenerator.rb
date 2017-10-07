module ArtistVenueGenerator
  class Generator < Jekyll::Generator
    def generate(site)
      @site = site

      asset_url = site.config['asset_url']
      if asset_url.nil?
        asset_url = ""
      end

      site.pages.each do |page|
        page.data['machine_name'] = machine_name(page.data['title'])

        if page.data['parent'] == "Artists" || page.data['parent'] == "Venues"
          if site.data['media']['artists'].key?(page.data['machine_name']) && site.data['media']['artists'][page.data['machine_name']].key?("medium")
            page.data['image'] = url_encode(site.data['media']['artists'][page.data['machine_name']]['medium'][0]).prepend("/")
          elsif site.data['media']['artists'].key?(page.data['machine_name']) && site.data['media']['artists'][page.data['machine_name']].key?("small")
            page.data['image'] = url_encode(site.data['media']['artists'][page.data['machine_name']]['small'][0]).prepend("/")
          end
        end
      end

    end

    def machine_name(input)
      return input.to_s.downcase.gsub(Regexp.union({' ' => '_', ',' => '', '$' => 'z', '!' => '', '.' => '', "'" => ''}.keys), {' ' => '_', ',' => '', '$' => 'z', '!' => '', '.' => '', "'" => ''})
    end

    def url_encode(input)
       return URI.escape(input.to_s)
    end
  end
end