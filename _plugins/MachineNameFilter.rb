module Jekyll
  module MachineNameFilter
    def machine_name(input)
        input.to_s.gsub(Regexp.union({' ' => '_', ',' => '', '$' => 'z', '!' => '', '.' => '', "'" => '', "&" => "and", 'è' => 'e'}.keys), {' ' => '_', ',' => '', '$' => 'z', '!' => '', '.' => '', "'" => '', "&" => "and", 'è' => 'e'})
    end
  end
end

Liquid::Template.register_filter(Jekyll::MachineNameFilter)