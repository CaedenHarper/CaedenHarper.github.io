# csTimer Solve Analyzer

A browser-based tool for analyzing and visualizing Rubik's Cube solve sessions exported from [csTimer](https://cstimer.net/).

The analyzer is written in TypeScript, HTML, and CSS, with Chart.js for graphing and Parcel for development and production builds. All solve data is processed locally in the browser and is not uploaded to a server.

## Features

### Import solve data

Solve sessions can be loaded in either of two ways:

- Paste a session summary copied directly from csTimer.
- Upload a semicolon-delimited CSV file exported by csTimer.

The text importer also accepts manually written solve lists with one solve per line. It recognizes solve times expressed in seconds, minutes, or hours, including `DNF` and `+2` penalties.

### Session statistics

The analyzer calculates and displays:

- Total number of solves
- Total time spent solving
- Number of DNFs
- Number of `+2` penalties
- Best single
- Worst single
- Mean solve time
- Median solve time
- Consistency measured by interquartile range (IQR)
- DNF rate
- `+2` rate

Statistics update immediately whenever the solve data or a setting changes.

### Averages of N

Enter any comma-separated list of average sizes, such as:

```text
5, 12, 100, 1000
```

For each valid size, the analyzer finds the best and worst average across the session. Averages use WCA-style trimming: the fastest and slowest 5% of solves are removed, rounded up to the next whole solve.

Hover over a displayed average to see every solve included in that average. When no sizes are entered, averages of 5 and 12 are calculated by default.

### Solve streaks

Enter one or more target times to find the longest consecutive streak below each target. For example:

```text
10, 15, 20, 25, 30
```

A DNF ends the current streak. The values above are used as defaults when no custom targets are entered.

### Solve-time histogram

The bar chart shows the distribution of solve times. Its range and bucket size can be customized with:

- Minimum graph time
- Maximum graph time
- Step size between buckets

The defaults are 5 seconds minimum, 30 seconds maximum, and 1-second steps.

When a date is selected from a timestamped CSV, a blue Solve history histogram is shown above a red histogram for the selected date. Each histogram includes a green dashed median marker. Clearing the date restores the original single untitled histogram.

### Filtering and penalty controls

The analyzer can be configured to:

- Use only the most recent N solves from a session
- Show statistics for a selected date when importing a timestamped CSV
- Compare that date's histogram and summary statistics with the solve history
- Move to the previous or next date containing solves, or clear the date filter
- Ignore DNFs
- Ignore `+2` penalties

Leaving the solve-count field empty analyzes the full imported session.

## Usage

1. Open the analyzer in a browser.
2. Paste csTimer output into the text box or upload a csTimer CSV export.
3. Optionally select a comparison date after importing a timestamped CSV.
4. Use the arrow buttons to move between dates containing solves, or Clear to return to the solve history.
5. Adjust graph, average, streak, solve-count, or penalty settings as needed.
6. Review the selected date's existing statistics plus its median, IQR consistency, DNF rate, and `+2` rate against the solve history.

## Development

The project is currently developed with Node.js 23.11.0.

Install dependencies:

```sh
npm ci
```

Start the local Parcel development server:

```sh
npm run start
```

Run the test suite:

```sh
npm test
```

Run ESLint:

```sh
npx eslint .
```

Create an unoptimized development build:

```sh
npm run build-dev
```

Create an optimized production build:

```sh
npm run build
```

## Deployment

Build the site before publishing the generated `dist` directory to the `gh-pages` branch:

```sh
npm run build
npm run push-gh-pages
```

## Technology

- TypeScript
- HTML
- CSS
- Chart.js
- Parcel
- Jest and ts-jest
- ESLint
