#!/usr/bin/env python3
"""
eda.py
Comprehensive exploratory data analysis script using pandas.
Usage:
    python3 eda.py [path/to/Final_data.csv]
If no path is provided, it will attempt to load 'Final_data.csv' from the script directory.

Outputs printed to stdout. Saves a correlation heatmap to `correlation_heatmap.png` if numeric columns exist.
"""

import sys
import os
from textwrap import shorten
import argparse
from datetime import datetime
import io

import pandas as pd
import numpy as np

# plotting (use Agg backend for headless environments)
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import seaborn as sns

# 1. Pandas display options
pd.set_option('display.max_columns', None)
pd.set_option('display.width', 1000)
pd.set_option('display.max_colwidth', 200)

# If --out-md is used we will collect printed lines here and write at the end
md_lines = None


def _log(msg):
    """Prints to stdout and appends to md_lines if enabled.

    msg can be a string or any object; non-strings will be converted with str().
    """
    # Always print to stdout for immediate feedback
    print(msg)
    # Append to markdown buffer if requested
    global md_lines
    if md_lines is not None:
        # Convert common pandas objects to readable strings
        try:
            if hasattr(msg, 'to_string'):
                md_lines.append(msg.to_string())
            else:
                md_lines.append(str(msg))
        except Exception:
            md_lines.append(str(msg))


def load_data(path: str) -> pd.DataFrame:
    if not os.path.exists(path):
        raise FileNotFoundError(f"File not found: {path}")
    return pd.read_csv(path)


def print_header(title: str):
    sep = '\n' + '=' * 80
    _log(sep)
    _log(title)
    _log('=' * 80)
    # Also add a markdown header when writing md
    global md_lines
    if md_lines is not None:
        md_lines.append('')
        md_lines.append('## ' + title)
        md_lines.append('')


def basic_info(df: pd.DataFrame):
    print_header('1. Basic DataFrame Info')
    _log(f'Shape: {df.shape} (rows, columns)')
    _log('\nDtypes and non-null counts:')
    # capture df.info() output
    buf = io.StringIO()
    df.info(buf=buf)
    info_text = buf.getvalue()
    _log(info_text)
    _log('\nMemory usage:')
    mem = df.memory_usage(deep=True)
    _log(mem.sort_values(ascending=False).head(20))


def missing_values_summary(df: pd.DataFrame):
    print_header('2. Missing Values Summary')
    missing = df.isnull().sum()
    missing = missing[missing > 0].sort_values(ascending=False)
    if missing.empty:
        _log('No missing values found.')
    else:
        pct = (missing / len(df) * 100).round(2)
        summary = pd.DataFrame({'missing_count': missing, 'missing_pct': pct})
        _log(summary.to_string())


def duplicate_summary(df: pd.DataFrame):
    print_header('3. Duplicate Rows')
    dup_count = df.duplicated().sum()
    _log(f'Duplicate rows (exact duplicates): {dup_count}')


def numeric_summary(df: pd.DataFrame):
    print_header('4. Numerical Columns Summary')
    num = df.select_dtypes(include=[np.number])
    if num.shape[1] == 0:
        _log('No numeric columns found.')
        return
    desc = num.describe(percentiles=[0.01, 0.05, 0.25, 0.5, 0.75, 0.95, 0.99]).T
    desc['skew'] = num.skew()
    desc['kurtosis'] = num.kurtosis()
    desc['missing_pct'] = (num.isnull().sum() / len(df) * 100).round(3)
    _log(desc.to_string())

    # show top 10 most skewed numeric columns
    skewed = desc['skew'].abs().sort_values(ascending=False).head(10)
    _log('\nTop skewed numeric features (abs skew):')
    _log(skewed.to_string())


def categorical_summary(df: pd.DataFrame):
    print_header('5. Categorical Columns Summary')
    cat = df.select_dtypes(include=['object', 'category'])
    if cat.shape[1] == 0:
        _log('No categorical columns found.')
        return
    for col in cat.columns:
        _log(f'--- Column: {col} ---')
        nunique = cat[col].nunique(dropna=False)
        cnt = cat[col].value_counts(dropna=False)
        _log(f'Unique values (incl. NaN): {nunique}')
        _log('Top value counts:')
        _log(cnt.head(10).to_string())
        if nunique <= 25:
            _log('All unique values:')
            _log(str(cat[col].unique().tolist()))
        else:
            sample_vals = pd.Series(cat[col].unique()).dropna().astype(str).tolist()[:10]
            _log('Sample unique values:')
            _log(str(sample_vals))
        _log('-' * 40)


def correlation_and_heatmap(df: pd.DataFrame, outpath='correlation_heatmap.png'):
    print_header('6. Correlation Matrix (Pearson)')
    num = df.select_dtypes(include=[np.number])
    if num.shape[1] < 2:
        _log('Not enough numeric columns to compute correlations.')
        return
    corr = num.corr()
    _log(corr.to_string())

    # Save heatmap
    plt.figure(figsize=(min(12, 0.5 * num.shape[1]), min(10, 0.4 * num.shape[1])))
    sns.heatmap(corr, annot=False, cmap='coolwarm', center=0)
    plt.title('Correlation heatmap')
    plt.tight_layout()
    try:
        plt.savefig(outpath, dpi=150)
        _log(f'Correlation heatmap saved to: {outpath}')
    except Exception as e:
        _log(f'Could not save heatmap: {e}')
    plt.close()


def target_analysis(df: pd.DataFrame):
    # Look for likely target columns
    candidates = [c for c in df.columns if c.lower() in ('target', 'label', 'y')]
    if not candidates:
        # try to find a column with small number of unique values that might be a label
        for col in df.columns:
            if df[col].nunique() <= 10 and df[col].dtype != 'float64':
                candidates.append(col)
    if not candidates:
        print_header('7. Target column not detected automatically')
        _log('No obvious `target`/`label` column found.')
        return

    col = candidates[0]
    print_header(f'7. Target/Label Analysis ({col})')
    _log(f'Dtype: {df[col].dtype}')
    _log('Unique values and counts:')
    _log(df[col].value_counts(dropna=False).to_string())
    if pd.api.types.is_numeric_dtype(df[col]):
        _log('\nNumeric target stats:')
        _log(df[col].describe().to_string())


def quick_recommendations(df: pd.DataFrame):
    print_header('8. Quick Modeling Recommendations')
    recs = []
    num = df.select_dtypes(include=[np.number])
    cat = df.select_dtypes(include=['object', 'category'])
    if num.shape[1] == 0:
        recs.append('- No numeric features detected; consider encoding/polynomial features or feature extraction from text.')
    else:
        recs.append(f'- {num.shape[1]} numeric features detected; consider scaling (Standard/MinMax) and handle skewed features.')
    if cat.shape[1] > 0:
        recs.append(f'- {cat.shape[1]} categorical features detected; consider one-hot or ordinal encoding (based on cardinality).')
    if df.isnull().any().any():
        recs.append('- Missing values detected; choose strategy: drop, impute (mean/median/mode), or model-specific handling.')
    if df.duplicated().sum() > 0:
        recs.append('- Duplicates present; consider dropping exact duplicates.')
    _log('\n'.join(recs))


def main():
    parser = argparse.ArgumentParser(description='Exploratory Data Analysis for a CSV dataset')
    parser.add_argument('csv', nargs='?', default='Final_data.csv', help='Path to CSV file (default: Final_data.csv)')
    parser.add_argument('--heatmap-out', default='correlation_heatmap.png', help='Output path for correlation heatmap PNG')
    parser.add_argument('--out-md', default=None, help='If set, save the full EDA report to this markdown file')
    args = parser.parse_args()

    path = args.csv
    _log(f'[{datetime.now().isoformat()}] Loading: {path}')
    try:
        df = load_data(path)
    except FileNotFoundError:
        _log(f"Error: '{path}' not found. Please make sure the file exists or supply a path.")
        sys.exit(2)
    except Exception as e:
        _log(f'Error loading CSV: {e}')
        sys.exit(3)

    # If requested, enable markdown collection
    global md_lines
    if args.out_md:
        md_lines = []
        # add a top-level title
        md_lines.append(f'# EDA Report for {os.path.basename(path)}')
        md_lines.append(f'_Generated: {datetime.now().isoformat()}_')
        md_lines.append('')

    basic_info(df)
    missing_values_summary(df)
    duplicate_summary(df)
    numeric_summary(df)
    categorical_summary(df)
    correlation_and_heatmap(df, outpath=args.heatmap_out)
    target_analysis(df)
    quick_recommendations(df)

    _log('\n--- End of EDA Report ---\n')


    if args.out_md:
        try:
            # Add link to heatmap if it exists
            heatmap_file = args.heatmap_out
            if os.path.exists(heatmap_file):
                md_lines.append('')
                md_lines.append('## Correlation heatmap')
                md_lines.append(f'![correlation heatmap]({os.path.basename(heatmap_file)})')
                md_lines.append('')

            with open(args.out_md, 'w', encoding='utf-8') as f:
                f.write('\n'.join(md_lines))
            print(f"Markdown report written to: {args.out_md}")
        except Exception as e:
            print(f"Failed to write markdown report: {e}")


if __name__ == '__main__':
    main()
