## Require vs import

All config files and scripts use `require` rather than `import`. The reason for this is that some of these are
dependencies of our babel setup, and therefore we cannot rely on babel for running these files, as it may not be
functional yet.
