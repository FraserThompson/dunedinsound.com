module Jekyll
  module MachineNameFilter
    def machine_name(input)
        input.to_s.gsub(Regexp.union({' ' => '_', ',' => '', '$' => 'z', '!' => '', '.' => '', "'" => '', "&" => "and"}.keys), {' ' => '_', ',' => '', '$' => 'z', '!' => '', '.' => '', "'" => '', "&" => "and"})
    end
  end
end

Liquid::Template.register_filter(Jekyll::MachineNameFilter)