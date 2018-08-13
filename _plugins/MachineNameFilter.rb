module Jekyll
  module MachineNameFilter
    def machine_name(input)
        input.to_s.gsub(Regexp.union({' ' => '_', ',' => '', '$' => 'z', '!' => '', '.' => '', "'" => '', "&" => "and", 'è' => 'e', '12' => 'twelve'}.keys), {' ' => '_', ',' => '', '$' => 'z', '!' => '', '.' => '', "'" => '', "&" => "and", 'è' => 'e', '12' => 'twelve'})
    end
  end
end

Liquid::Template.register_filter(Jekyll::MachineNameFilter)