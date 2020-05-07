# Gets all Mp3 files from year
$FindDate=Get-Date -Year 2015
$SourcePath="G:\dev\dunedinsound-gatsby\src\content\gigs\**\*.mp3"
$TempDirectory="E:\Scratch\"
$intendedSampleRate="48000"
$badSampleRate="44100"

$Files = Get-Childitem -Path $SourcePath -Recurse -ErrorAction SilentlyContinue | Where-Object { $_.LastWriteTime.Year -eq $FindDate.Year } | Resolve-Path -Relative | foreach-object {
    $sampleRate = sox --i -r "$_"
    if ($sampleRate -eq $badSampleRate) {
        $filename = Split-Path $_ -leaf
        if (!(Test-Path "$TempDirectory$filename.wav")) {
            sox "$_" "$TempDirectory$filename.wav" rate $intendedSampleRate
        }
        "$TempDirectory$filename.wav";
    } else {
        "$_";
    }
}

echo($Files)

sox --norm -m $Files -e floating-point output.wav
