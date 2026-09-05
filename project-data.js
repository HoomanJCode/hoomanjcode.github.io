window.PROJECTS = {
  impasse: {
    number: '01', category: 'GAME / UNITY', title: 'Impasse', eyebrow: 'A puzzle about moving together', storyKicker: 'The game', storyTitle: ['Together', 'is a', 'mechanic.'],
    description: 'A 2D isometric puzzle-action game about friendship, coordination, and hope. Winner of the Isfahan University Game Dev Camp Final Jam.',
    palette: [[18, 44, 40], [235, 180, 70], [58, 190, 175], [255, 118, 92]],
    paragraphs: [
      'Impasse turns cooperation into the central mechanic. Its isometric spaces ask players to read the environment, coordinate movement, and keep going when the path ahead looks blocked.',
      'The project sits at the intersection of expressive level design and responsive Unity gameplay: a small jam-sized world built around the emotional payoff of finding a way through together.'
    ],
    techKicker: 'Notes from the build',
    techTitle: ['Coordination', 'built into', 'every level.'],
    technical: [
      'Impasse is built around one design constraint: no solution works unless the characters move together. The isometric presentation and the grid-based spaces are shaped around that constraint, so reading depth, timing a move, and holding position all feed the same coordination problem.',
      'Implemented in Unity with C#, the game keeps its interaction vocabulary small and readable — few verbs, clear feedback, and levels that teach the coordination rule before they test it.'
    ],
    techPoints: [
      'Isometric presentation with a consistent grid for depth reading',
      'Coordination-first puzzle logic: solutions require synchronized movement',
      'Small interaction vocabulary with immediate visual feedback',
      'Jam-scoped Unity / C# codebase built for a tight deadline'
    ],
    technologies: ['Unity', 'C#', 'Isometric design', 'Puzzle-action'],
    facts: [['Type', 'Final jam game'], ['Award', 'Isfahan University Game Dev Camp'], ['Focus', 'Cooperation & hope']],
    source: 'https://hoomanj.itch.io/impasse', sourceLabel: 'Play Impasse', sourceType: 'itch.io',
    media: [
      { image: '../../assets/projects/impasse/cover.webp', alt: 'Impasse cover artwork', caption: 'COVER / 01' },
      { image: '../../assets/projects/impasse/gameplay-1.gif', alt: 'Impasse gameplay animation', caption: 'GAMEPLAY / 02' },
      { image: '../../assets/projects/impasse/gameplay-2.gif', alt: 'Impasse gameplay animation', caption: 'GAMEPLAY / 03' },
      { image: '../../assets/projects/impasse/screen-1.webp', alt: 'Impasse in-game screenshot', caption: 'SCREEN / 04' },
      { image: '../../assets/projects/impasse/gameplay-3.gif', alt: 'Impasse gameplay animation', caption: 'GAMEPLAY / 05' }
    ]
  },
  'balls-of-chaos': {
    number: '02', category: 'GAME JAM / ARCADE', title: 'Balls of Chaos', eyebrow: 'Survive the swarm', storyKicker: 'The loop', storyTitle: ['Pressure', 'becomes', 'play.'],
    description: 'An arcade bullet-hell survival game where you challenge your sense of survival in a chaotic arena filled with balls. Made in seven days.',
    palette: [[30, 22, 40], [248, 202, 33], [200, 70, 68], [160, 205, 75]],
    paragraphs: [
      'Balls of Chaos compresses the pressure of a survival game into a focused arcade loop. The arena keeps moving, the threats keep multiplying, and every second asks for a sharper read of the space around you.',
      'Built during a seven-day jam with MadZaa, CrispyOnion, and hesamjalalpoor, it is a compact exercise in readable chaos: expressive motion, escalating danger, and immediate feedback.'
    ],
    techKicker: 'Notes from the build',
    techTitle: ['Chaos,', 'engineered to', 'stay readable.'],
    technical: [
      'Balls of Chaos is an exercise in making many moving threats legible. The core loop asks the player to read a crowded arena in real time, which pushes the design toward strong silhouettes, clear color roles, and movement that communicates intent before impact.',
      'Built in Unity and C# during a seven-day jam with MadZaa, CrispyOnion, and hesamjalalpoor, the project compresses a survival loop into an escalating arcade session: the arena fills up, the patterns multiply, and the difficulty curve stays fair but relentless.'
    ],
    techPoints: [
      'High-visibility threat design: distinct shapes and color roles per hazard',
      'Escalating spawn and difficulty logic over a compressed run',
      'Unity / C# codebase organized for a four-person, seven-day jam',
      'Bullet-hell patterns tuned for fairness under screen pressure'
    ],
    technologies: ['Unity', 'C#', 'Arcade', 'Bullet hell'],
    facts: [['Type', '7-day game jam'], ['Team', 'MadZaa · HoomanJ · CrispyOnion · hesamjalalpoor'], ['Focus', 'Survival & escalation']],
    source: 'https://madzaa.itch.io/balls-of-chaos', sourceLabel: 'Play Balls of Chaos', sourceType: 'itch.io',
    media: [
      { image: '../../assets/projects/balls-of-chaos/cover.gif', alt: 'Balls of Chaos animated cover artwork', caption: 'COVER / 01' },
      { image: '../../assets/projects/balls-of-chaos/gameplay-1.gif', alt: 'Balls of Chaos gameplay animation', caption: 'GAMEPLAY / 02' },
      { image: '../../assets/projects/balls-of-chaos/screen-1.webp', alt: 'Balls of Chaos in-game screenshot', caption: 'SCREEN / 03' },
      { image: '../../assets/projects/balls-of-chaos/screen-2.webp', alt: 'Balls of Chaos in-game screenshot', caption: 'SCREEN / 04' },
      { image: '../../assets/projects/balls-of-chaos/screen-3.webp', alt: 'Balls of Chaos in-game screenshot', caption: 'SCREEN / 05' }
    ]
  },
  fxplanet: {
    number: '03', category: 'GENERATIVE ART / FXHASH', title: 'FxPlanet', eyebrow: 'A small universe of variations', storyKicker: 'The system', storyTitle: ['Difference', 'inside', 'a pattern.'],
    description: 'A collection of 2,000 unique planets generated from layers of noise, code, and a little cosmic patience. An interactive collection on Tezos.',
    palette: [[42, 74, 128], [143, 190, 255], [213, 190, 120], [83, 175, 140]],
    paragraphs: [
      'FxPlanet explores how a compact set of rules can produce a wide visual language. Each planet is assembled procedurally, making texture, color, atmosphere, and orbital detail part of the generative system rather than a fixed illustration.',
      'The result is a collection that treats repetition as a way to discover difference: every output belongs to the same family, but no two worlds need to feel identical.'
    ],
    techKicker: 'Notes from the build',
    techTitle: ['One rule set,', 'two thousand', 'worlds.'],
    technical: [
      'FxPlanet is a generative system before it is a collection: every planet is produced by the same compact rule set, with layered noise controlling terrain, color, atmosphere, and orbital detail. The variety comes from the parameter space, not from hand-drawn assets.',
      'The generator is written in JavaScript and mints through the fxhash platform, where each edition computes its artwork from a unique hash. Every output is reproducible from its seed while still belonging to the same visual family — 2,000 editions, one underlying system.'
    ],
    techPoints: [
      'Layered procedural noise drives terrain, color, and atmosphere',
      'Seed-based generation: every planet is reproducible from its hash',
      'Palette systems constrain the space so outputs stay in one family',
      'Pure JavaScript rendered at mint time on fxhash / Tezos'
    ],
    technologies: ['JavaScript', 'Procedural noise', 'Generative art', 'Tezos / fxhash'],
    facts: [['Edition', '2,000 unique planets'], ['Medium', 'Generative code'], ['Platform', 'fxhash · Tezos']],
    source: 'https://www.fxhash.xyz/generative/slug/fxplanet', sourceLabel: 'View FxPlanet', sourceType: 'fxhash',
    media: [
      { visual: 'art-planet', alt: 'Procedurally textured planet with a glowing orbital ring', caption: 'GENERATIVE / 03' },
      { visual: 'art-planet alt-art', alt: 'Layered noise texture and orbital geometry', caption: 'RULES / VARIATIONS' }
    ]
  },
  'hecs-gravity-sim': {
    number: '04', category: 'SIMULATION / UNITY ECS', title: 'HEcsGravitySim', eyebrow: 'One thousand bodies, one frame', storyKicker: 'The simulation', storyTitle: ['Many bodies.', 'One shared', 'force.'],
    description: 'A Unity gravity simulation using ECS and the Job System to calculate the force of each planet on every other planet in real time.',
    palette: [[12, 16, 26], [205, 210, 220], [150, 200, 255], [200, 255, 110]],
    paragraphs: [
      'The simulation is built around the problem of nested calculations. With roughly 1,000 planets, calculating every interaction on a single thread becomes impractical for a real-time experience.',
      'The project uses Unity ECS, the Job System, a data-oriented architecture, Hybrid Renderer, and Unity Physics. A random generator creates planet positions while a gravity system gathers entities and schedules force calculations each frame.'
    ],
    techKicker: 'Notes from the build',
    techTitle: ['A thousand bodies,', 'one', 'multithreaded frame.'],
    technical: [
      'The simulation computes the force of each planet on every other planet every frame — two nested loops over roughly 1,000 bodies, which cannot run on a single thread at real-time speeds. The answer is CPU multithreading and a data-oriented approach.',
      'The project uses Unity ECS, the Job System, and data-oriented programming. A random generator places planets, and each frame a gravity system gathers planet entities with an EntityQuery and schedules a job that adds calculated forces to velocity components, letting the physics engine move the bodies.'
    ],
    techPoints: [
      'N-body gravity: every planet affects every other planet each frame',
      'Unity Job System for multithreaded force calculation',
      'ECS architecture with a Planet component and a GravitySystem',
      'EntityQuery gathers planet entities once per frame',
      'Hybrid Renderer for fast rendering of many entities',
      'Unity Physics (Havok) integrates velocities into positions'
    ],
    technologies: ['Unity', 'C#', 'ECS', 'Job System', 'Unity Physics'],
    facts: [['Scale', '1,000 planets'], ['Pattern', 'Data-oriented programming'], ['Focus', 'Multithreaded simulation']],
    source: 'https://github.com/HoomanJCode/HEcsGravitySim', sourceLabel: 'View on GitHub', sourceType: 'GitHub',
    related: [{ url: 'https://www.aparat.com/v/GpcBv', label: 'Watch rendered video', type: 'Aparat' }],
    image: 'https://opengraph.githubassets.com/1/HoomanJCode/HEcsGravitySim',
    media: [
      { image: '../../assets/projects/hecs-gravity-sim/capture.webp', alt: 'HEcsGravitySim Unity screenshot showing a field of simulated planets', caption: 'CAPTURE / 04' },
      { visual: 'art-gravity alt-art', alt: 'Orbital paths representing ECS gravity calculations', caption: 'FORCES / FRAME' }
    ]
  },
  'rainy-cloud': {
    number: '05', category: 'GAME / PUZZLE', title: 'Rainy Cloud', eyebrow: 'Build a way above the water', storyKicker: 'The escape', storyTitle: ['Small hands', 'against', 'rising water.'],
    description: 'A 2D puzzle game in which a little girl and a magical fox escape a flood. Collect objects and make a boat before the water reaches the surface.',
    palette: [[22, 38, 32], [86, 146, 120], [225, 221, 175], [112, 142, 84]],
    paragraphs: [
      'Rainy Cloud frames a time-sensitive puzzle around resourcefulness. The player searches a flooded world, gathers what is useful, and turns scattered objects into a way forward.',
      'Its premise gives every small interaction a clear emotional weight: the puzzle is not only about finding the solution, but about protecting a friendship while the water keeps rising.'
    ],
    techKicker: 'Notes from the build',
    techTitle: ['Rising water', 'as a', 'deadline.'],
    technical: [
      'Rainy Cloud turns time into pressure: the water level is the clock, and every object the player collects is a step toward building a boat before the flood reaches the surface. The puzzle design is built around this deadline, so exploration and collection always carry urgency.',
      'Implemented in Unity with C#, the game keeps a small set of interactions — search, collect, combine — and lets the environment, rather than the interface, communicate the state of the rising water.'
    ],
    techPoints: [
      'Water-level mechanic acts as a visible countdown',
      'Collection-and-crafting loop: gathered objects become the boat',
      'Small interaction vocabulary focused on exploration',
      'Unity / C# 2D puzzle built for a game jam'
    ],
    technologies: ['Unity', 'C#', '2D puzzle', 'Game jam'],
    facts: [['Type', '2D puzzle game'], ['Characters', 'A girl & a magical fox'], ['Pressure', 'A rising flood']],
    source: 'https://hoomanj.itch.io/rainy-cloud', sourceLabel: 'Play Rainy Cloud', sourceType: 'itch.io',
    media: [
      { image: '../../assets/projects/rainy-cloud/cover.jpg', alt: 'Rainy Cloud game title artwork', caption: 'COVER / 01' },
      { image: '../../assets/projects/rainy-cloud/screen-1.webp', alt: 'Rainy Cloud gameplay screenshot', caption: 'SCREEN / 02' },
      { image: '../../assets/projects/rainy-cloud/screen-2.webp', alt: 'Rainy Cloud gameplay screenshot', caption: 'SCREEN / 03' },
      { image: '../../assets/projects/rainy-cloud/screen-3.webp', alt: 'Rainy Cloud gameplay screenshot', caption: 'SCREEN / 04' },
      { image: '../../assets/projects/rainy-cloud/screen-4.webp', alt: 'Rainy Cloud gameplay screenshot', caption: 'SCREEN / 05' },
      { image: '../../assets/projects/rainy-cloud/screen-5.webp', alt: 'Rainy Cloud gameplay screenshot', caption: 'SCREEN / 06' },
      { image: '../../assets/projects/rainy-cloud/screen-6.webp', alt: 'Rainy Cloud gameplay screenshot', caption: 'SCREEN / 07' }
    ]
  },
  'concurrent-tools': {
    number: '06', category: 'UNITY PACKAGE / C#', title: 'ConcurrentTools', eyebrow: 'Make asynchronous work feel at home', storyKicker: 'The utility', storyTitle: ['Async work', 'without', 'friction.'],
    description: 'A Unity task-management package for asynchronous, delayed, and concurrent operations while keeping main-thread work compatible with Unity APIs.',
    palette: [[21, 45, 42], [102, 224, 173], [213, 255, 79], [255, 118, 92]],
    paragraphs: [
      'ConcurrentTools packages a common game-development need into a small, reusable workflow. It can run simple actions, await asynchronous tasks, schedule delayed work, return results, and apply execution timeouts.',
      'The task runner is designed to keep the boundary between background work and Unity’s main thread explicit, helping projects stay responsive without giving up the APIs that need to run in the scene.'
    ],
    techKicker: 'Notes from the build',
    techTitle: ['Async work,', 'without', 'the friction.'],
    technical: [
      'ConcurrentTools wraps common async patterns into a single task runner for Unity. It executes simple actions, awaits asynchronous tasks, schedules delayed work, returns results through callbacks, and abandons tasks that exceed a timeout — all while keeping Unity API calls on the main thread.',
      'Everything goes through one entry point, EnumeratorRunner.Run, so background work gets a consistent vocabulary. The package installs through Unity Package Manager and initializes automatically, with no manual setup.'
    ],
    techPoints: [
      'Single EnumeratorRunner.Run API for actions, async tasks, and results',
      'Delayed execution with a time parameter',
      'Timeout support abandons long-running tasks',
      'Main-thread execution keeps Unity API calls safe',
      'Installs via Unity Package Manager from a git URL'
    ],
    technologies: ['Unity', 'C#', 'async / await', 'Task scheduling'],
    facts: [['Type', 'Reusable package'], ['Includes', 'Delayed & concurrent tasks'], ['Safety', 'Timeout support']],
    source: 'https://github.com/HoomanJCode/ConcurrentTools-Package', sourceLabel: 'View on GitHub', sourceType: 'GitHub',
    image: 'https://opengraph.githubassets.com/1/HoomanJCode/ConcurrentTools-Package',
    media: [
      { image: 'https://opengraph.githubassets.com/1/HoomanJCode/ConcurrentTools-Package', alt: 'ConcurrentTools GitHub project preview', caption: 'TOOLS / 06' },
      { visual: 'art-tools alt-art', alt: 'Modular blocks representing concurrent task workflows', caption: 'TASK / RUNNER' }
    ]
  },
  'menu-view': {
    number: '07', category: 'UNITY PACKAGE / UI', title: 'MenuView', eyebrow: 'A cleaner way through menus', storyKicker: 'The interface', storyTitle: ['Every view', 'needs a', 'way forward.'],
    description: 'A Unity menu-management tool for creating views, switching between them, and managing navigation across multiple layers.',
    palette: [[28, 33, 54], [150, 160, 230], [213, 255, 79], [255, 118, 92]],
    paragraphs: [
      'MenuView replaces repeated menu wiring with a focused view model. A menu inherits from MenuView, initializes its own controls, and uses shared commands to move to another view or return to the previous one.',
      'The package is deliberately small: it gives UI flows a predictable navigation vocabulary while leaving each project free to define its own screens and interaction design.'
    ],
    techKicker: 'Notes from the build',
    techTitle: ['A view model', 'for every', 'menu flow.'],
    technical: [
      'MenuView replaces repeated menu wiring with a small view model. A menu script inherits from MenuView, initializes its own controls in Init(), and uses shared commands to switch views or step back through the navigation history.',
      'The package exposes static commands like ChangeCurrentView<T>() and ChangeToLastView(), so moving between screens becomes a typed, predictable operation. It installs from a git URL through Unity Package Manager.'
    ],
    techPoints: [
      'MenuView base class with an Init() hook per screen',
      'ChangeCurrentView<T>() for typed navigation',
      'ChangeToLastView() with a layered view history',
      'Static commands keep call sites free of wiring',
      'Installs via Unity Package Manager from a git URL'
    ],
    technologies: ['Unity', 'C#', 'MonoBehaviour', 'UI navigation'],
    facts: [['Type', 'Reusable package'], ['Core API', 'ChangeCurrentView()'], ['Pattern', 'Layered view history']],
    source: 'https://github.com/HoomanJCode/MenuView-Package', sourceLabel: 'View on GitHub', sourceType: 'GitHub',
    image: 'https://opengraph.githubassets.com/1/HoomanJCode/MenuView-Package',
    media: [
      { image: 'https://opengraph.githubassets.com/1/HoomanJCode/MenuView-Package', alt: 'MenuView GitHub project preview', caption: 'INTERFACE / 07' },
      { visual: 'art-menu alt-art', alt: 'Layered interface panels representing menu navigation', caption: 'VIEWS / HISTORY' }
    ]
  },
  v2portal: {
    number: '08', category: 'SOFTWARE / NETWORKING', title: 'V2Portal', eyebrow: 'Proxy infrastructure from the terminal', storyKicker: 'The network', storyTitle: ['Routes are', 'choices in', 'motion.'],
    description: 'A cross-platform, headless V2Ray CLI client and proxy manager for sing-box and Xray-core.',
    palette: [[20, 34, 40], [213, 255, 79], [145, 186, 255], [255, 118, 92]],
    paragraphs: [
      'V2Portal manages the full path from proxy profile to local inbound. It imports subscriptions and share links, supports profiles and groups, runs persistent SOCKS5 or HTTP servers, and exposes rule-based split routing.',
      'The tool is built for terminals, automation, servers, home labs, and LAN proxy sharing. It stores configuration locally, supports multiple proxy protocols, and keeps system-wide proxy settings untouched.'
    ],
    techKicker: 'Notes from the build',
    techTitle: ['One CLI,', 'two proxy', 'engines.'],
    technical: [
      'V2Portal is a headless V2Ray CLI client that manages the full path from subscription to local inbound. It imports subscriptions and share links, decodes them into profiles, groups them with balancing or chaining strategies, and runs persistent SOCKS5, HTTP, or mixed inbounds — all with rule-based split routing.',
      'sing-box is the default engine and Xray-core is selected automatically when a protocol or strategy requires it; engine binaries are downloaded on demand. Configuration is stored as local JSON with rolling backups, and the CLI exposes JSON output and boot services for automation.'
    ],
    techPoints: [
      'Dual-engine support: sing-box by default, Xray-core when required',
      'Subscription and share-link import with updates and pruning',
      'Proxy groups with latency, random, round-robin, and least-load strategies',
      'Proxy chaining through ordered hops',
      'Persistent SOCKS5 / HTTP / mixed inbounds with split routing',
      'JSON config, rolling backups, and JSON CLI output for automation'
    ],
    technologies: ['Python 3.10+', 'sing-box', 'Xray-core', 'CLI', 'JSON configuration'],
    facts: [['Platforms', 'Linux · Windows · macOS · Termux'], ['Modes', 'Groups, chains & split routing'], ['Status', 'PyPI package']],
    source: 'https://github.com/HoomanJCode/V2Portal', sourceLabel: 'View on GitHub', sourceType: 'GitHub',
    image: 'https://opengraph.githubassets.com/1/HoomanJCode/V2Portal',
    media: [
      { image: 'https://opengraph.githubassets.com/1/HoomanJCode/V2Portal', alt: 'V2Portal GitHub project preview', caption: 'PORTAL / 08' },
      { visual: 'art-portal alt-art', alt: 'Nested routing rings representing proxy groups and chains', caption: 'ROUTES / GROUPS' }
    ]
  },
  'proxy-tuner': {
    number: '09', category: 'SOFTWARE / NETWORKING', title: 'ProxyTuner', eyebrow: 'Decide where traffic belongs', storyKicker: 'The policy', storyTitle: ['Intent', 'chooses the', 'outbound.'],
    description: 'An alpha Python CLI that routes connections through multiple SOCKS5, HTTP CONNECT, or direct outbounds using flexible routing rules.',
    palette: [[30, 38, 52], [160, 190, 240], [120, 150, 190], [213, 255, 79]],
    paragraphs: [
      'ProxyTuner acts as the policy layer in front of several network paths. Rules can match domains, IPs and CIDR ranges, ports, process names, paths, and regular expressions, with lower priorities evaluated first.',
      'It can run a local SOCKS5 and HTTP CONNECT proxy, test upstreams, report statistics, and work alongside V2Portal: V2Portal manages available proxies while ProxyTuner decides which traffic goes where.'
    ],
    techKicker: 'Notes from the build',
    techTitle: ['Rules decide', 'where traffic', 'belongs.'],
    technical: [
      'ProxyTuner is the policy layer in front of several network paths. A local listener accepts SOCKS5 and HTTP CONNECT clients on the same port, evaluates each connection against priority-ordered rules, and relays bytes through the selected outbound — direct, SOCKS5, or HTTP CONNECT.',
      'Rules combine matchers with AND logic inside a rule and OR logic within a field: domains, IPs and CIDR ranges, ports, process names, and regular expressions. It is built on asyncio with bidirectional relay, retries, pooling, DNS caching, and per-outbound statistics — and it pairs with V2Portal to complete a rule-driven proxy stack.'
    ],
    techPoints: [
      'Single listener with SOCKS5 / HTTP CONNECT protocol auto-detection',
      'Priority-ordered first-match routing rules',
      'Domain, IP / CIDR, port, and process matchers with regex support',
      'asyncio forwarding with pooling, retries, and DNS caching',
      'Optional username / password authentication on upstream proxies',
      'Complements V2Portal: it manages proxies, ProxyTuner routes traffic'
    ],
    technologies: ['Python 3.10+', 'asyncio', 'SOCKS5', 'HTTP CONNECT', 'Split routing'],
    facts: [['Status', 'Alpha software'], ['Rules', 'Priority & first match'], ['Pairs with', 'V2Portal']],
    source: 'https://github.com/HoomanJCode/ProxyTuner', sourceLabel: 'View on GitHub', sourceType: 'GitHub',
    image: 'https://opengraph.githubassets.com/1/HoomanJCode/ProxyTuner',
    media: [
      { image: 'https://opengraph.githubassets.com/1/HoomanJCode/ProxyTuner', alt: 'ProxyTuner GitHub project preview', caption: 'ROUTING / 09' },
      { visual: 'art-proxy alt-art', alt: 'Multiple outbound paths representing routing policy choices', caption: 'POLICY / OUTBOUND' }
    ]
  },
  'simple-meeting-app': {
    number: '10', category: 'WEB APP / SOFTWARE', title: 'Simple Meeting App', eyebrow: 'Make a room for people to meet', storyKicker: 'The product', storyTitle: ['A room', 'becomes a', 'community.'],
    description: 'A real-time Meetup-like web application for creating and joining tech meetings, with authentication, live participant updates, and meeting discovery.',
    palette: [[14, 20, 34], [101, 112, 240], [86, 168, 250], [160, 120, 225]],
    paragraphs: [
      'The application combines a searchable meeting list with the social details that make a session feel alive: hosts, participants, tags, calendars, event timelines, and dark mode.',
      'Under the surface it pairs an Express API with SQLite and Socket.IO, while a React and Vite frontend handles the experience. Google OAuth, JWT access and refresh tokens, and a broad automated test suite keep the prototype grounded in real product concerns.'
    ],
    techKicker: 'Notes from the build',
    techTitle: ['A real-time stack,', 'tested', 'end to end.'],
    technical: [
      'The app pairs an Express 5 / TypeScript backend with a React 18 frontend. SQLite via better-sqlite3 stores meetings and users, Socket.IO pushes live participant and meeting updates, and Google OAuth issues JWT access and refresh tokens.',
      'The repository is split into backend, frontend, and Playwright E2E suites: 84+ backend tests with Vitest and Supertest, 52+ frontend tests with Testing Library, and full browser flows for auth, meetings, participants, and realtime. Two scripts — dev and prod — bootstrap the whole stack with an inline environment wizard.'
    ],
    techPoints: [
      'Express 5 + TypeScript REST API with Zod environment validation',
      'SQLite via better-sqlite3 with migrations',
      'Socket.IO for live participant counts and meeting updates',
      'Google OAuth 2.0 with JWT access / refresh tokens',
      'React 18 + Vite + Tailwind frontend with a token-refresh API client',
      '84+ backend, 52+ frontend, and Playwright E2E tests'
    ],
    technologies: ['Node.js', 'Express 5', 'TypeScript', 'React 18', 'Socket.IO', 'SQLite'],
    facts: [['Realtime', 'Socket.IO'], ['Auth', 'Google OAuth 2.0 + JWT'], ['Testing', 'Vitest · Playwright']],
    source: 'https://github.com/HoomanJCode/SimpleMeetingApp', sourceLabel: 'View on GitHub', sourceType: 'GitHub',
    image: 'https://opengraph.githubassets.com/1/HoomanJCode/SimpleMeetingApp',
    media: [
      { image: '../../assets/projects/simple-meeting-app/home.webp', alt: 'Simple Meeting App home screen with meeting list and filters', caption: 'HOME / 10' },
      { image: '../../assets/projects/simple-meeting-app/home-dark.webp', alt: 'Simple Meeting App home screen in dark mode', caption: 'DARK MODE / 10' },
      { image: '../../assets/projects/simple-meeting-app/meeting-detail.webp', alt: 'Simple Meeting App meeting detail screen with participants', caption: 'MEETING DETAIL / 10' },
      { image: '../../assets/projects/simple-meeting-app/create-meeting.webp', alt: 'Simple Meeting App create meeting form', caption: 'CREATE / 10' },
      { image: '../../assets/projects/simple-meeting-app/calendar.webp', alt: 'Simple Meeting App calendar view', caption: 'CALENDAR / 10' },
      { image: '../../assets/projects/simple-meeting-app/timeline.webp', alt: 'Simple Meeting App event timeline', caption: 'TIMELINE / 10' },
      { image: '../../assets/projects/simple-meeting-app/my-meetings.webp', alt: 'Simple Meeting App my meetings view', caption: 'MY MEETINGS / 10' }
    ]
  },
  'telegram-7z-bot': {
    number: '11', category: 'TELEGRAM BOT / AUTOMATION', title: 'Telegram 7z Bot', eyebrow: 'Turn links into useful archives', storyKicker: 'The workflow', storyTitle: ['Files', 'move at the', 'speed of chat.'],
    description: 'A modular Telegram bot that downloads files from URLs, creates optional password-protected 7z archives, and provides expiring direct download links.',
    palette: [[34, 26, 48], [190, 160, 255], [213, 255, 79], [255, 118, 92]],
    paragraphs: [
      'The bot brings a complete file workflow into chat: download one or many URLs, archive them, split large files for Telegram, browse recent hosted files, and clean up expired storage automatically.',
      'It separates configuration, download and archive logic, Telegram handlers, and the file server. Optional aria2 support, AES-256 archive encryption, access control, and deployment workflows make it a practical systems experiment.'
    ],
    techKicker: 'Notes from the build',
    techTitle: ['A file pipeline', 'that lives', 'in chat.'],
    technical: [
      'The bot turns URLs and uploads into a complete file workflow inside Telegram: downloads via aria2 with multi-connection support or direct HTTP, packs everything into 7z archives with optional AES-256 encryption, and serves expiring direct download links through a built-in HTTP server.',
      'The codebase is modular — configuration, core logic, Telegram handlers, and the file server are separate packages — with .env-driven settings, access-control whitelists, automatic cleanup of expired files, and GitHub Actions workflows for deployment, backups, and health checks.'
    ],
    techPoints: [
      'aria2 multi-connection downloads with direct HTTP fallback',
      '7z archiving with optional AES-256 password protection',
      'Built-in HTTP server with configurable file expiration',
      'Automatic splitting of large files for Telegram limits',
      'Modular config / core / handlers / services layout',
      'GitHub Actions CI/CD with deployment, backup, and health checks'
    ],
    technologies: ['Python 3.8+', 'Telegram Bot API', '7-Zip', 'aria2', 'HTTP server'],
    facts: [['Input', 'URLs or uploaded files'], ['Output', '7z archive or direct link'], ['Retention', 'Configurable expiration']],
    source: 'https://github.com/HoomanJCode/Telegram_7z_Bot', sourceLabel: 'View on GitHub', sourceType: 'GitHub',
    image: 'https://opengraph.githubassets.com/1/HoomanJCode/Telegram_7z_Bot',
    media: [
      { image: 'https://opengraph.githubassets.com/1/HoomanJCode/Telegram_7z_Bot', alt: 'Telegram 7z Bot GitHub project preview', caption: 'ARCHIVE / 11' },
      { visual: 'art-archive alt-art', alt: 'Archive blocks and a Telegram workflow', caption: 'BATCH / EXPIRE' }
    ]
  },
  'http-tunnel': {
    number: '12', category: 'NETWORKING / HTTP', title: 'Http-Tunnel', eyebrow: 'A research path through HTTP', storyKicker: 'The experiment', storyTitle: ['Find a path', 'through the', 'narrowest gate.'],
    description: 'An experimental proof-of-concept that tunnels TCP and UDP traffic through HTTP POST requests for restricted networks where only HTTP is allowed.',
    palette: [[21, 24, 34], [255, 118, 92], [145, 186, 255], [213, 255, 79]],
    paragraphs: [
      'Http-Tunnel gives applications a local SOCKS5 entry point, wraps traffic in encrypted HTTP POST requests, and returns responses through HTTP bodies. It includes server-side DNS resolution, compression, adaptive keep-alive, connection pooling, session recovery, and UDP support.',
      'The project is explicitly educational and not production-ready. Its documentation calls out basic unaudited encryption, possible man-in-the-middle exposure, latency overhead, and the need to use it only on networks where testing is authorized.'
    ],
    techKicker: 'Notes from the build',
    techTitle: ['TCP over', 'HTTP POST,', 'as research.'],
    technical: [
      'Http-Tunnel is a proof-of-concept that carries TCP and UDP traffic inside HTTP POST requests for networks where only HTTP is allowed. A local SOCKS5 proxy accepts application traffic, wraps it in encrypted POSTs, and a remote server unwraps it and connects to the real destination.',
      'The package separates crypto, compression, protocol, stream, server, and client modules. It adds zlib compression, adaptive keep-alive, connection pooling, QoS priority for interactive ports, session recovery, server-side DNS resolution, and UDP relay — while the README is explicit that the encryption is unaudited and the tool is not for production use.'
    ],
    techPoints: [
      'SOCKS5 client proxy tunneling through HTTP/1.1 POST bodies',
      'TCP and UDP relay with server-side DNS resolution',
      'Zlib compression and adaptive keep-alive to cut overhead',
      'Session recovery with retry and exponential backoff',
      'Modular package: crypto, compression, protocol, stream, client, server',
      'Explicitly experimental — unaudited encryption, not production-ready'
    ],
    technologies: ['Python 3.7+', 'HTTP POST', 'SOCKS5', 'TCP / UDP', 'Zlib'],
    facts: [['Status', 'Experimental / research'], ['Transport', 'HTTP/1.1 POST'], ['Warning', 'Not for production use']],
    source: 'https://github.com/HoomanJCode/Http-Tunnel', sourceLabel: 'View on GitHub', sourceType: 'GitHub',
    image: 'https://opengraph.githubassets.com/1/HoomanJCode/Http-Tunnel',
    media: [
      { image: 'https://opengraph.githubassets.com/1/HoomanJCode/Http-Tunnel', alt: 'HTTP Tunnel GitHub project preview', caption: 'TUNNEL / 12' },
      { visual: 'art-tunnel alt-art', alt: 'Nested HTTP tunnel rings representing encapsulated traffic', caption: 'POST / RESPONSE' }
    ]
  },
  'telegram-insta-bot': {
    number: '13', category: 'TELEGRAM BOT / AUTOMATION', title: 'Telegram Insta Bot', eyebrow: 'Bring social media into a chat workflow', storyKicker: 'The pipeline', storyTitle: ['Capture.', 'Cache.', 'Deliver.'],
    description: 'An educational Telegram bot that downloads Instagram posts, reels, stories, and profile pictures using gallery-dl, async I/O, caching, and batched media uploads.',
    palette: [[32, 26, 44], [255, 140, 180], [190, 110, 220], [90, 140, 255]],
    paragraphs: [
      'The bot turns a pasted Instagram link into a Telegram delivery flow. Carousel posts become media groups, reels become video, and cached downloads can be resent without repeating the work.',
      'It also explores the operational details around automation: per-user cookies, whitelists, download locks, cache cleanup, rate limits, and the practical limits of Telegram media groups.'
    ],
    techKicker: 'Notes from the build',
    techTitle: ['Capture.', 'Cache.', 'Deliver.'],
    technical: [
      'The bot turns an Instagram link into a Telegram delivery flow using gallery-dl for extraction and async I/O throughout. Carousel posts become media groups, reels become video, stories and profile pictures download on demand, and every result is cached so resends never repeat the work.',
      'Operational details are handled explicitly: per-user cookies with validation, a whitelist for access control, download locks that prevent duplicate work, configurable auto-cleanup of stored files, and batching that respects Telegram’s ten-item media-group limit.'
    ],
    techPoints: [
      'gallery-dl extraction for posts, reels, stories, and profile pictures',
      'Async I/O with batched media-group uploads (up to 10 items)',
      'Persistent download cache with resend support',
      'Per-user cookie storage with validation',
      'Download locks prevent duplicate concurrent work',
      'Whitelist access control and auto-cleanup of expired files'
    ],
    technologies: ['Python 3.8+', 'Telegram Bot API', 'gallery-dl', 'async I/O', 'Caching'],
    facts: [['Media', 'Posts · reels · stories'], ['Batching', 'Up to 10 items per group'], ['Status', 'Educational project']],
    source: 'https://github.com/HoomanJCode/Telegram_Insta_Bot', sourceLabel: 'View on GitHub', sourceType: 'GitHub',
    image: 'https://opengraph.githubassets.com/1/HoomanJCode/Telegram_Insta_Bot',
    media: [
      { image: 'https://opengraph.githubassets.com/1/HoomanJCode/Telegram_Insta_Bot', alt: 'Telegram Insta Bot GitHub project preview', caption: 'INSTAGRAM / 13' },
      { visual: 'art-instagram alt-art', alt: 'Social media content flowing into a Telegram delivery queue', caption: 'CACHE / DELIVER' }
    ]
  },
  'telegram-youtube': {
    number: '14', category: 'TELEGRAM BOT / AUTOMATION', title: 'Telegram YouTube', eyebrow: 'A media toolbox inside Telegram', storyKicker: 'The toolbox', storyTitle: ['More formats.', 'One simple', 'conversation.'],
    description: 'An educational YouTube downloader bot for Telegram, supporting video, audio, thumbnails, subtitles, format selection, caching, and direct links.',
    palette: [[36, 22, 28], [255, 120, 120], [255, 70, 90], [145, 186, 255]],
    paragraphs: [
      'Telegram YouTube makes media choices explicit: pick a video quality, an audio format, a thumbnail, or subtitle behavior, then choose whether the result is uploaded to Telegram or served as a download link.',
      'The project brings together yt-dlp, FFmpeg where needed, Deno for extraction, an aiohttp file server, cookie management, inline mode, deep-link tokens, and automatic cleanup in one self-contained process.'
    ],
    techKicker: 'Notes from the build',
    techTitle: ['Every format,', 'one', 'conversation.'],
    technical: [
      'Telegram YouTube makes media choices explicit: video quality, audio format, thumbnails, and subtitle behavior are all selectable, and the result can be uploaded to Telegram or served as a direct download link. Extraction runs through yt-dlp with Deno for YouTube, and FFmpeg handles conversion and subtitle embedding.',
      'The whole service is one self-contained process: an aiohttp file server serves downloads, cookies live in RAM only, duplicate downloads are detected per variant, and inline mode plus deep-link tokens let people share content outside the bot chat. Opus audio is transcoded to AAC automatically for Smart TV playback.'
    ],
    techPoints: [
      'yt-dlp extraction with a Deno runtime for YouTube',
      'Per-variant quality selection: video, audio, thumbnail, subtitles',
      'Two delivery paths: Telegram upload or direct download link',
      'Built-in aiohttp file server with optional native HTTPS',
      'Duplicate detection per format variant',
      'Cookies kept in RAM only; Opus to AAC transcode for Smart TVs'
    ],
    technologies: ['Python 3.8+', 'yt-dlp', 'aiohttp', 'FFmpeg', 'Deno'],
    facts: [['Formats', 'Video · audio · thumbnail'], ['Delivery', 'Telegram upload or link'], ['Status', 'Educational project']],
    source: 'https://github.com/HoomanJCode/Telegram_Yt_Bot', sourceLabel: 'View on GitHub', sourceType: 'GitHub',
    image: 'https://opengraph.githubassets.com/1/HoomanJCode/Telegram_Yt_Bot',
    media: [
      { image: 'https://opengraph.githubassets.com/1/HoomanJCode/Telegram_Yt_Bot', alt: 'Telegram YouTube Bot GitHub project preview', caption: 'YOUTUBE / 14' },
      { visual: 'art-youtube alt-art', alt: 'Video, audio, and thumbnail delivery paths', caption: 'FORMAT / DELIVERY' }
    ]
  }
};
