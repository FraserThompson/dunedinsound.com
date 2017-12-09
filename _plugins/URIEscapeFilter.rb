module Jekyll
    module UriEscapeFilter
        def uri_escape(input)
            unless input.nil?
                URI.escape(input).to_s.gsub(Regexp.union({'%C3%A8' => '%E8', '#' => '%23', "'" => "%27"}.keys), {'%C3%A8' => '%E8', '#' => '%23', "'" => "%27"})
            end
        end
    end
end
  
Liquid::Template.register_filter(Jekyll::UriEscapeFilter)