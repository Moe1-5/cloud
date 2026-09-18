param(
  [string]$InputPath = "docs/task2-musleh-report.md",
  [string]$OutputPath = "docs/Musleh_Task_2_Report.docx"
)

$ErrorActionPreference = "Stop"

$projectRoot = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot ".."))
$inputFile = [System.IO.Path]::GetFullPath((Join-Path $projectRoot $InputPath))
$outputFile = [System.IO.Path]::GetFullPath((Join-Path $projectRoot $OutputPath))

if (-not $inputFile.StartsWith($projectRoot, [System.StringComparison]::OrdinalIgnoreCase)) {
  throw "Input path must remain inside the project."
}

if (-not $outputFile.StartsWith($projectRoot, [System.StringComparison]::OrdinalIgnoreCase)) {
  throw "Output path must remain inside the project."
}

if (-not (Test-Path -LiteralPath $inputFile)) {
  throw "Report source was not found: $inputFile"
}

function Convert-InlineMarkdown([string]$Text) {
  return $Text.Replace("**", "").Replace([string][char]96, "")
}

function Add-Paragraph {
  param(
    [object]$Document,
    [string]$Text,
    [string]$Style = "Normal",
    [switch]$KeepWithNext
  )

  $paragraph = $Document.Paragraphs.Add()
  $paragraph.Range.Text = Convert-InlineMarkdown $Text
  try {
    $paragraph.Range.Style = $Style
  } catch {
    $paragraph.Range.Style = "Normal"
  }
  $paragraph.Format.SpaceAfter = 6
  $paragraph.Format.KeepWithNext = if ($KeepWithNext.IsPresent) { -1 } else { 0 }
  $paragraph.Range.InsertParagraphAfter()
  return $paragraph
}

function Add-CodeBlock {
  param(
    [object]$Document,
    [string[]]$Lines
  )

  $paragraph = $Document.Paragraphs.Add()
  $paragraph.Range.Text = ($Lines -join "`r`n")
  $paragraph.Range.Font.Name = "Consolas"
  $paragraph.Range.Font.Size = 9
  $paragraph.Range.Shading.BackgroundPatternColor = 15132390
  $paragraph.Format.LeftIndent = 18
  $paragraph.Format.RightIndent = 18
  $paragraph.Format.SpaceBefore = 6
  $paragraph.Format.SpaceAfter = 10
  $paragraph.Range.InsertParagraphAfter()
}

function Add-MarkdownTable {
  param(
    [object]$Document,
    [string[]]$Lines
  )

  $dataRows = @($Lines | Where-Object { $_ -notmatch '^\|\s*:?-{3,}' })
  if ($dataRows.Count -eq 0) {
    return
  }

  $rows = @()
  foreach ($line in $dataRows) {
    $trimmed = $line.Trim().Trim('|')
    $rows += ,@($trimmed.Split('|') | ForEach-Object { (Convert-InlineMarkdown $_.Trim()) })
  }

  $columnCount = ($rows | ForEach-Object { $_.Count } | Measure-Object -Maximum).Maximum
  $range = $Document.Range($Document.Content.End - 1, $Document.Content.End - 1)
  $table = $Document.Tables.Add($range, $rows.Count, $columnCount)
  $table.Style = "Table Grid"
  $table.AllowAutoFit = $true
  $table.AutoFitBehavior(2)

  for ($rowIndex = 0; $rowIndex -lt $rows.Count; $rowIndex++) {
    for ($columnIndex = 0; $columnIndex -lt $columnCount; $columnIndex++) {
      $value = if ($columnIndex -lt $rows[$rowIndex].Count) { $rows[$rowIndex][$columnIndex] } else { "" }
      $cell = $table.Cell($rowIndex + 1, $columnIndex + 1)
      $cell.Range.Text = $value
      $cell.Range.Font.Name = "Aptos"
      $cell.Range.Font.Size = 9
      if ($rowIndex -eq 0) {
        $cell.Range.Bold = 1
        $cell.Shading.BackgroundPatternColor = 14277081
      }
      if ($value -match 'TBD|Pending') {
        $cell.Range.HighlightColorIndex = 7
      }
    }
  }

  $afterTable = $Document.Range($Document.Content.End - 1, $Document.Content.End - 1)
  $afterTable.InsertParagraphAfter()
}

$word = $null
$document = $null

try {
  $word = New-Object -ComObject Word.Application
  $word.Visible = $false
  $word.DisplayAlerts = 0
  $document = $word.Documents.Add()

  $document.PageSetup.TopMargin = $word.CentimetersToPoints(2.2)
  $document.PageSetup.BottomMargin = $word.CentimetersToPoints(2.2)
  $document.PageSetup.LeftMargin = $word.CentimetersToPoints(2.3)
  $document.PageSetup.RightMargin = $word.CentimetersToPoints(2.3)

  $normalStyle = $document.Styles.Item("Normal")
  $normalStyle.Font.Name = "Aptos"
  $normalStyle.Font.Size = 10.5
  $normalStyle.ParagraphFormat.SpaceAfter = 6
  $normalStyle.ParagraphFormat.LineSpacingRule = 0

  foreach ($styleName in @("Title", "Heading 1", "Heading 2", "Heading 3")) {
    $style = $document.Styles.Item($styleName)
    $style.Font.Name = "Aptos Display"
    $style.Font.Color = 7623746
  }

  $title = Add-Paragraph -Document $document -Text "Musleh Task 2 Report" -Style "Title"
  $title.Alignment = 1
  $title.Format.SpaceBefore = 80
  $title.Format.SpaceAfter = 24

  foreach ($line in @(
    "Cloud-Based Disaster Relief Coordination System",
    "CT071-3-3-DDAC Group Project - Task 2",
    "Mohamed Mohammed Musleh Mohammed",
    "Serverless Emergency/Resource, Frontend and Performance Lead",
    "AWS Region: us-east-1",
    "Prepared 18 September 2026"
  )) {
    $coverLine = Add-Paragraph -Document $document -Text $line
    $coverLine.Alignment = 1
    $coverLine.Range.Font.Size = 12
  }

  $document.Paragraphs.Add().Range.InsertBreak(7)

  $lines = Get-Content -LiteralPath $inputFile -Encoding UTF8
  $index = 0
  while ($index -lt $lines.Count) {
    $line = $lines[$index]

    if ($index -eq 0 -and $line -match '^#\s+') {
      $index++
      continue
    }

    if ($line -eq '```text') {
      $codeLines = @()
      $index++
      while ($index -lt $lines.Count -and $lines[$index] -ne '```') {
        $codeLines += $lines[$index]
        $index++
      }
      Add-CodeBlock -Document $document -Lines $codeLines
      $index++
      continue
    }

    if ($line.StartsWith('|')) {
      $tableLines = @()
      while ($index -lt $lines.Count -and $lines[$index].StartsWith('|')) {
        $tableLines += $lines[$index]
        $index++
      }
      Add-MarkdownTable -Document $document -Lines $tableLines
      continue
    }

    if ($line -match '^###\s+(.+)$') {
      Add-Paragraph -Document $document -Text $Matches[1] -Style "Heading 3" -KeepWithNext | Out-Null
    } elseif ($line -match '^##\s+(.+)$') {
      Add-Paragraph -Document $document -Text $Matches[1] -Style "Heading 1" -KeepWithNext | Out-Null
    } elseif ($line -match '^#\s+(.+)$') {
      Add-Paragraph -Document $document -Text $Matches[1] -Style "Title" -KeepWithNext | Out-Null
    } elseif ($line -match '^[-*]\s+(.+)$') {
      Add-Paragraph -Document $document -Text $Matches[1] -Style "List Bullet" | Out-Null
    } elseif ([string]::IsNullOrWhiteSpace($line)) {
      $document.Paragraphs.Add().Range.InsertParagraphAfter()
    } else {
      $paragraph = Add-Paragraph -Document $document -Text $line
      if ($line -match 'TBD|Do not change this status') {
        $paragraph.Range.HighlightColorIndex = 7
      }
    }

    $index++
  }

  foreach ($section in $document.Sections) {
    $footer = $section.Footers.Item(1)
    $footer.Range.Text = "Musleh Task 2 - Serverless Emergency Workflow    "
    $footer.Range.Font.Name = "Aptos"
    $footer.Range.Font.Size = 8
    $footer.Range.ParagraphFormat.Alignment = 2
    $null = $footer.Range.Fields.Add($footer.Range, -1, "PAGE", $true)
  }

  $outputDirectory = Split-Path -Parent $outputFile
  if (-not (Test-Path -LiteralPath $outputDirectory)) {
    $null = New-Item -ItemType Directory -Path $outputDirectory -Force
  }

  $document.SaveAs2($outputFile, 16)
  $document.Close($false)
  $document = $null
  $word.Quit()
  $word = $null
} finally {
  if ($null -ne $document) {
    $document.Close($false)
  }
  if ($null -ne $word) {
    $word.Quit()
  }
  [GC]::Collect()
  [GC]::WaitForPendingFinalizers()
}

Get-Item -LiteralPath $outputFile | Select-Object FullName, Length, LastWriteTime
