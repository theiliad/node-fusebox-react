const {
    FuseBox,
    SVGPlugin,
    CSSPlugin,
    BabelPlugin,
    QuantumPlugin,
    WebIndexPlugin,
    Sparky
} = require("fuse-box");

let fuse, app, vendor, isProduction;

// Sparky is the fusebox task manager http://fuse-box.org/page/sparky
Sparky.task("config", () => {
    fuse = new FuseBox({
        homeDir: "src/",
        sourceMaps: !isProduction,
        hash: isProduction,
        output: "dist/$name.js",
        plugins: [
            // BabelPlugin will take care of all the jsx files in React
            BabelPlugin({
                config: {
                    sourceMaps: true,
                    presets: ["es2015"],
                    plugins: [
                        ["transform-react-jsx"],
                    ],
                },
            }),

            // SVG & CSS plugins will make sure to add CSS & SVG files to your bundle when you import them
            SVGPlugin(), CSSPlugin(),

            // This plugin adds your bundles to the "src/index.html" file and store the new file in the "dist" folder
            WebIndexPlugin({
                template: "src/index.html",
                path: "../dist"
            }),

            // Quantum plugin is an optional optimizer made by Fusebox to make your bundle work faster
            isProduction && QuantumPlugin({
                removeExportsInterop: false,
                uglify: true
            })
        ]
    });

    // Bundle the vendor scripts (react etc.)
    vendor = fuse.bundle("vendor").instructions("~ index.jsx")

    // Bundle the app
    app = fuse.bundle("app").instructions("> [index.jsx]")
});

// This is the default task that gets called when you run "node fuse"
Sparky.task("default", ["clean", "config"], () => {
    fuse.dev();

    // Hot Module Replacement
    app.watch().hmr()
    
    return fuse.run();
});

// This task cleans the dist folder everytime there's a new bundle to be made
Sparky.task("clean", () => Sparky.src("dist/").clean("dist/"));