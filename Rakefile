require 'rubygems'
require 'jammit'
require 'fileutils'

desc "Use Jammit to compile the multiple versions of Backbone UI"
task :build do
  $VS_MIN = false
  Jammit.package!({
    :config_path   => "assets.yml",
    :output_folder => "build"
  })
  
  $VS_MIN = true
  Jammit.package!({
    :config_path   => "assets.yml",
    :output_folder => "build-min"
  })
  
  # Move the JSTs back to lib to accomodate the demo page.
  FileUtils.mv("build/backbone-ui-templates.js", "lib/js/templates/templates.js")
      
  # Fix image url paths.
  ['build', 'build-min'].each do |build|
    File.open("#{build}/backbone-ui.css", 'r+') do |file|
      css = file.read
      css.gsub!(/url\((.*?)images\/embed\/icons/, 'url(../images/embed/icons')
      file.rewind
      file.write(css)
      file.truncate(css.length)
    end
  end
  
  # path = "../internat-backend/public/javascripts/libs"
  # Move files to App dir
  #FileUtils.cp("lib/js/templates/templates.js", path  + "/backbone-ui-templates.js");
  #FileUtils.cp("build/backbone-ui-dependencies.js", path  + "/backbone-ui-dependencies.js");
  #FileUtils.cp("build/backbone-ui.js", path  + "/backbone-ui.js");
  #FileUtils.cp("build/backbone-ui.css", "../internat-backend/public/stylesheets/backbone-ui.css");
  
end

desc "Build the docco documentation"
task :docs do
  sh "docco lib/js/*.js lib/js/**/*.js"
end
