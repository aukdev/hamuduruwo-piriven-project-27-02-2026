# Generates a minimal, robust .component.spec.ts next to every *.component.ts
# under src/app. Detects:
#   - component class name
#   - whether the component injects MAT_DIALOG_DATA / MatDialogRef
# Produces a standalone-component TestBed setup that wires HttpClientTestingModule,
# RouterTestingModule, NoopAnimationsModule and (when needed) dialog providers.

$ErrorActionPreference = 'Stop'

$root = Join-Path $PSScriptRoot 'src/app'
$componentFiles = Get-ChildItem -Path $root -Recurse -Filter '*.component.ts' |
    Where-Object { $_.Name -notlike '*.spec.ts' }

function Get-ComponentClassName {
    param([string]$Content)
    $m = [regex]::Match($Content, 'export\s+class\s+([A-Za-z0-9_]+Component)\b')
    if ($m.Success) { return $m.Groups[1].Value }
    return $null
}

foreach ($file in $componentFiles) {
    $specPath = [System.IO.Path]::ChangeExtension($file.FullName, '.spec.ts')
    # Actually we want foo.component.spec.ts — ChangeExtension on .ts yields foo.component.spec (wrong). Build manually:
    $specPath = $file.FullName -replace '\.component\.ts$', '.component.spec.ts'

    $content = Get-Content -Raw $file.FullName
    $className = Get-ComponentClassName -Content $content
    if (-not $className) {
        Write-Warning "Skip (no class found): $($file.FullName)"
        continue
    }

    $importRel = '.' + [System.IO.Path]::DirectorySeparatorChar + $file.BaseName
    $importRel = $importRel -replace '\\', '/'

    $injectsDialogData = $content -match 'MAT_DIALOG_DATA'
    $injectsDialogRef  = $content -match 'MatDialogRef'

    $extraImports = @()
    $extraProviders = @()
    if ($injectsDialogData) {
        $extraImports += "import { MAT_DIALOG_DATA } from '@angular/material/dialog';"
        $extraProviders += "        { provide: MAT_DIALOG_DATA, useValue: {} },"
    }
    if ($injectsDialogRef) {
        $extraImports += "import { MatDialogRef } from '@angular/material/dialog';"
        $extraProviders += "        { provide: MatDialogRef, useValue: { close: () => {} } },"
    }

    $extraImportsStr  = ($extraImports -join "`n")
    $extraProvidersStr = ($extraProviders -join "`n")
    if ($extraProvidersStr) { $extraProvidersStr = "`n$extraProvidersStr" }

    $spec = @"
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
$extraImportsStr

import { $className } from '$importRel';

describe('$className', () => {
  let component: $className;
  let fixture: ComponentFixture<$className>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        $className,
        NoopAnimationsModule,
        HttpClientTestingModule,
        RouterTestingModule,
      ],
      providers: [$extraProvidersStr
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent($className);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
"@

    Set-Content -Path $specPath -Value $spec -Encoding UTF8
    Write-Host "Wrote $specPath"
}

Write-Host "Done. Generated $($componentFiles.Count) spec files."
