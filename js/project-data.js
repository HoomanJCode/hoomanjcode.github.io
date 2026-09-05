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
    fa: {
      category: 'بازی / یونیتی',
      eyebrow: 'معمایی درباره حرکت با هم',
      description: 'یک بازی معمایی-اکشن ایزومتریک دوبعدی درباره دوستی، هماهنگی و امید. برنده جایزه کمپ نهایی جمدِو دانشگاه اصفهان.',
      paragraphs: [
        'امپاس همکاری را به مکانیک اصلی بازی تبدیل می‌کند. فضاهای ایزومتریکش از بازیکن می‌خواهند محیط را بخواند، حرکت را هماهنگ کند و وقتی مسیر جلویش بسته به نظر می‌رسد، ادامه دهد.',
        'پروژه در تقاطع طراحی سطح بیانی و گیم‌پلی واکنش‌گرای یونیتی قرار می‌گیرد: جهانی کوچک در اندازه یک جم که حول پاداش احساسی پیدا کردن راه با هم ساخته شده است.'
      ],
      storyKicker: 'بازی',
      storyTitle: ['با هم حرکت کردن', 'خودش', 'مکانیک بازی است.'],
      techKicker: 'یادداشت‌هایی از ساخت',
      techTitle: ['هماهنگی', 'ساخته‌شده در', 'هر مرحله.'],
      technical: [
        'امپاس حول یک قید طراحی ساخته شده است: هیچ راه‌حلی کار نمی‌کند مگر اینکه شخصیت‌ها با هم حرکت کنند. ارائه ایزومتریک و فضاهای شبکه‌ای حول همین قید شکل گرفته‌اند تا خواندن عمق، زمان‌بندی حرکت و حفظ جایگاه، همگی به یک مسئله هماهنگی تبدیل شوند.',
        'بازی با یونیتی و C# پیاده‌سازی شده و واژگان تعاملی آن عمداً کوچک و خوانا نگه داشته شده است — چند کنش محدود، بازخورد واضح و مراحلی که قانون هماهنگی را قبل از امتحان کردنش آموزش می‌دهند.'
      ],
      techPoints: [
        'ارائه ایزومتریک با شبکه‌ای ثابت برای خواندن عمق',
        'منطق معمایی هماهنگی‌محور: راه‌حل‌ها به حرکت هماهنگ نیاز دارند',
        'واژگان تعاملی کوچک با بازخورد بصری فوری',
        'کدبیس یونیتی / C# در مقیاس جم برای ضرب‌العجل فشرده'
      ],
      facts: [['نوع', 'بازی نهایی جم'], ['جایزه', 'کمپ بازی‌سازی دانشگاه اصفهان'], ['تمرکز', 'همکاری و امید']],
      sourceLabel: 'بازی Impasse'
    },
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
    fa: {
      category: 'جم / آرکید',
      eyebrow: 'از موج زنده بمان',
      description: 'یک بازی آرکید بقا در سبک بولت-هل که در میدان پرآشوبی پر از توپ، حس بقایتان را محک می‌زند. ساخته‌شده در هفت روز.',
      paragraphs: [
        'بالز آو کازوس فشار یک بازی بقا را در یک حلقه آرکید متمرکز می‌کند. میدان مدام در حرکت است، تهدیدها مدام زیاد می‌شوند و هر ثانیه خوانش تیزتری از فضای اطراف می‌طلبد.',
        'این بازی در یک جم هفت‌روزه با مدزا، کریسپیانیون و حسام جلال‌پور ساخته شده است؛ تمرینی فشرده در هرج‌ومرج خوانا: حرکت بیانگر، خطر فزاینده و بازخورد فوری.'
      ],
      storyKicker: 'حلقه بازی',
      storyTitle: ['فشار', 'تبدیل به', 'بازی می‌شود.'],
      techKicker: 'یادداشت‌هایی از ساخت',
      techTitle: ['هرج‌ومرجی', 'مهندسی‌شده برای', 'خوانایی.'],
      technical: [
        'بالز آو کازوس تمرینی در خوانا کردن تهدیدهای متحرک زیاد است. حلقه اصلی از بازیکن می‌خواهد میدان شلوغ را در لحظه بخواند؛ همین موضوع طراحی را به سمت سیلوئت‌های قوی، نقش‌های رنگی مشخص و حرکتی که قصد را قبل از برخورد منتقل می‌کند سوق داده است.',
        'بازی با یونیتی و C# در یک جم هفت‌روزه با سه سازنده دیگر ساخته شده و حلقه بقا را در یک نشست آرکید فزاینده فشرده می‌کند: میدان پر می‌شود، الگوها زیاد می‌شوند و منحنی دشواری عادلانه اما بی‌رحم می‌ماند.'
      ],
      techPoints: [
        'طراحی تهدید با دید بالا: شکل‌های متمایز و نقش رنگی برای هر خطر',
        'منطق افزایشی ظهور دشمن و دشواری در یک اجرای فشرده',
        'کدبیس یونیتی / C# برای جم چهارنفره هفت‌روزه',
        'الگوهای بولت-هل تنظیم‌شده برای عدالت زیر فشار صفحه'
      ],
      facts: [['نوع', 'جم بازی ۷ روزه'], ['تیم', 'مدزا · هومن‌جی · کریسپیانیون · حسام‌جلال‌پور'], ['تمرکز', 'بقا و فزایندگی']],
      sourceLabel: 'بازی Balls of Chaos'
    },
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
    fa: {
      category: 'هنر مولد / اف‌ایکس‌هدش',
      eyebrow: 'جهان کوچکی از تغییرات',
      description: 'مجموعه‌ای از ۲٬۰۰۰ سیاره منحصربه‌فرد که از لایه‌های نویز، کد و کمی صبر کیهانی ساخته شده‌اند. مجموعه‌ای تعاملی روی تزوس.',
      paragraphs: [
        'اف‌ایکس‌پلنت کاوش می‌کند که چگونه یک مجموعه قوانین فشرده می‌تواند زبان بصری گسترده‌ای تولید کند. هر سیاره رویه‌ای ساخته می‌شود و بافت، رنگ، جو و جزئیات مداری همگی بخشی از سیستم مولد می‌شوند نه یک تصویر ثابت.',
        'نتیجه مجموعه‌ای است که تکرار را راهی برای کشف تفاوت می‌داند: هر خروجی به همان خانواده تعلق دارد، اما هیچ دو جهانی لازم نیست یکسان حس شوند.'
      ],
      storyKicker: 'سیستم',
      storyTitle: ['تفاوت', 'درون', 'یک الگو.'],
      techKicker: 'یادداشت‌هایی از ساخت',
      techTitle: ['یک مجموعه قانون،', 'دو هزار', 'جهان.'],
      technical: [
        'اف‌ایکس‌پلنت پیش از آنکه یک مجموعه باشد یک سیستم مولد است: هر سیاره با همان مجموعه قوانین فشرده تولید می‌شود و نویز لایه‌ای، زمین، رنگ، جو و جزئیات مداری را کنترل می‌کند. تنوع از فضای پارامترها می‌آید، نه از دارایی‌های دست‌ساز.',
        'مولد به زبان جاوااسکریپت نوشته شده و روی پلتفرم اف‌ایکس‌هدش ضرب می‌شود، جایی که هر نسخه اثرش را از یک هش یکتا محاسبه می‌کند. هر خروجی از seed خود قابل بازتولید است و همچنان به همان خانواده بصری تعلق دارد — ۲٬۰۰۰ نسخه، یک سیستم زیربنایی.'
      ],
      techPoints: [
        'نویز رویه‌ای لایه‌ای برای زمین، رنگ و جو',
        'تولید مبتنی بر seed: هر سیاره از هش خود قابل بازتولید است',
        'سیستم‌های پالت فضا را محدود می‌کنند تا خروجی‌ها در یک خانواده بمانند',
        'جاوااسکریپت خالص رندر شده در زمان ضرب روی اف‌ایکس‌هدش / تزوس'
      ],
      facts: [['نسخه‌ها', '۲٬۰۰۰ سیاره یکتا'], ['رسانه', 'کد مولد'], ['پلتفرم', 'fxhash · تزوس']],
      sourceLabel: 'مشاهده FxPlanet'
    },
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
    fa: {
      category: 'شبیه‌سازی / ECS یونیتی',
      eyebrow: 'هزار جرم، یک فریم',
      description: 'شبیه‌سازی گرانش یونیتی با ECS و سیستم Job که نیروی هر سیاره بر همه سیاره‌های دیگر را در لحظه محاسبه می‌کند.',
      paragraphs: [
        'شبیه‌سازی حول مسئله محاسبات تودرتو ساخته شده است. با حدود هزار سیاره، محاسبه هر برهم‌کنش روی یک ترد برای تجربه بی‌درنگ غیرعملی می‌شود.',
        'پروژه از Unity ECS، سیستم Job، معماری داده‌محور، Hybrid Renderer و Unity Physics استفاده می‌کند. یک مولد تصادفی موقعیت سیاره‌ها را می‌سازد و هر فریم سیستم گرانش موجودیت‌ها را جمع می‌کند و محاسبات نیرو را زمان‌بندی می‌کند.'
      ],
      storyKicker: 'شبیه‌سازی',
      storyTitle: ['جرم‌های بسیار،', 'یک نیروی', 'مشترک.'],
      techKicker: 'یادداشت‌هایی از ساخت',
      techTitle: ['هزار جرم،', 'یک فریم', 'چندریسمانی.'],
      technical: [
        'شبیه‌سازی نیروی هر سیاره بر همه سیاره‌های دیگر را هر فریم محاسبه می‌کند — دو حلقه تودرتو روی حدود ۱٬۰۰۰ جرم که با سرعت بی‌درنگ روی یک ترد ممکن نیست. راه‌حل، چندریسمانی شدن CPU و رویکرد داده‌محور است.',
        'پروژه از Unity ECS، سیستم Job و برنامه‌نویسی داده‌محور استفاده می‌کند. یک مولد تصادفی سیاره‌ها را جای‌گذاری می‌کند و هر فریم سیستم گرانش با EntityQuery موجودیت‌های سیاره را جمع می‌زند و یک job زمان‌بندی می‌کند که نیروهای محاسبه‌شده را به کامپوننت‌های سرعت اضافه می‌کند تا موتور فیزیک اجسام را جابه‌جا کند.'
      ],
      techPoints: [
        'گرانش N-جسم: هر سیاره هر فریم روی همه سیاره‌های دیگر اثر می‌گذارد',
        'سیستم Job یونیتی برای محاسبه نیروی چندریسمانی',
        'معماری ECS با کامپوننت Planet و کلاس GravitySystem',
        'EntityQuery موجودیت‌های سیاره را هر فریم جمع می‌کند',
        'Hybrid Renderer برای رندر سریع موجودیت‌های زیاد',
        'Unity Physics (هاوک) سرعت‌ها را به موقعیت تبدیل می‌کند'
      ],
      facts: [['مقیاس', '۱٬۰۰۰ سیاره'], ['الگو', 'برنامه‌نویسی داده‌محور'], ['تمرکز', 'شبیه‌سازی چندریسمانی']],
      sourceLabel: 'مشاهده در گیت‌هاب'
    },
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
    fa: {
      category: 'بازی / معمایی',
      eyebrow: 'راهی بالاتر از آب بساز',
      description: 'یک بازی معمایی دوبعدی که در آن یک دختر کوچک و یک روباه جادویی از سیل فرار می‌کنند. اشیا را جمع کنید و قبل از رسیدن آب به سطح، قایق بسازید.',
      paragraphs: [
        'رینی کلود یک معمای زمان‌حساس را حول تدبیر می‌سازد. بازیکن جهانی غرق‌شده را جست‌وجو می‌کند، چیزهای مفید جمع می‌کند و اشیای پراکنده را به راهی برای پیش‌روی تبدیل می‌کند.',
        'این پیش‌فرض به هر تعامل کوچک وزن احساسی روشنی می‌دهد: معمای بازی فقط یافتن راه‌حل نیست، بلکه محافظت از یک دوستی است در حالی که آب همچنان بالا می‌آید.'
      ],
      storyKicker: 'فرار',
      storyTitle: ['دست‌های کوچک', 'در برابر', 'آب در حال بالا آمدن.'],
      techKicker: 'یادداشت‌هایی از ساخت',
      techTitle: ['آب در حال بالا آمدن', 'به‌عنوان', 'ضرب‌العجل.'],
      technical: [
        'رینی کلود زمان را به فشار تبدیل می‌کند: سطح آب ساعت بازی است و هر شیئی که بازیکن جمع می‌کند، قدمی به سوی ساختن قایق پیش از رسیدن سیل به سطح است. طراحی معمایی حول این ضرب‌العجل بنا شده تا جست‌وجو و جمع‌آوری همیشه فوریت داشته باشند.',
        'بازی با یونیتی و C# پیاده‌سازی شده و مجموعه تعاملاتش کوچک نگه داشته شده است — جست‌وجو، جمع‌آوری، ترکیب — و این محیط است که وضعیت آب در حال بالا آمدن را منتقل می‌کند، نه رابط کاربری.'
      ],
      techPoints: [
        'مکانیک سطح آب به‌عنوان شمارش معکوس دیداری',
        'حلقه جمع‌آوری و ساخت: اشیای جمع‌شده به قایق تبدیل می‌شوند',
        'واژگان تعاملی کوچک متمرکز بر کاوش',
        'معمای دوبعدی یونیتی / C# ساخته‌شده برای یک جم'
      ],
      facts: [['نوع', 'بازی معمایی دوبعدی'], ['شخصیت‌ها', 'یک دختر و یک روباه جادویی'], ['فشار', 'سیلی فزاینده']],
      sourceLabel: 'بازی Rainy Cloud'
    },
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
    fa: {
      category: 'پکیج یونیتی / C#',
      eyebrow: 'کار ناهمزمان را به خانه بیاور',
      description: 'پکیج مدیریت تسک یونیتی برای عملیات‌های ناهمزمان، تأخیری و همزمان، با حفظ سازگاری کارهای ترد اصلی با APIهای یونیتی.',
      paragraphs: [
        'کانکارنت‌تولز یک نیاز رایج توسعه بازی را در گردش‌کاری کوچک و قابل‌استفاده‌مجدد بسته‌بندی می‌کند. می‌تواند اکشن‌های ساده اجرا کند، تسک‌های ناهمزمان را منتظر بماند، کار تأخیری زمان‌بندی کند، نتیجه برگرداند و برای اجرا مهلت زمانی تعیین کند.',
        'اجراکننده تسک طوری طراحی شده که مرز میان کار پس‌زمینه و ترد اصلی یونیتی صریح بماند؛ به پروژه‌ها کمک می‌کند واکنش‌گرا بمانند بدون اینکه APIهایی که باید در صحنه اجرا شوند را از دست بدهند.'
      ],
      storyKicker: 'ابزار',
      storyTitle: ['کار ناهمزمان', 'بدون', 'اصطکاک.'],
      techKicker: 'یادداشت‌هایی از ساخت',
      techTitle: ['کار ناهمزمان،', 'بدون', 'اصطکاک.'],
      technical: [
        'کانکارنت‌تولز الگوهای ناهمزمان رایج را در یک اجراکننده تسک واحد برای یونیتی جمع می‌کند. اکشن‌های ساده اجرا می‌کند، تسک‌های ناهمزمان را منتظر می‌ماند، کار تأخیری زمان‌بندی می‌کند، نتیجه را از طریق callback برمی‌گرداند و تسک‌هایی که از مهلت فراتر بروند رها می‌کند — همه در حالی که فراخوانی‌های API یونیتی روی ترد اصلی می‌مانند.',
        'همه چیز از یک نقطه ورودی واحد به نام EnumeratorRunner.Run عبور می‌کند تا کار پس‌زمینه واژگان ثابتی داشته باشد. پکیج از طریق Unity Package Manager نصب می‌شود و به‌طور خودکار مقداردهی می‌شود، بدون راه‌اندازی دستی.'
      ],
      techPoints: [
        'یک API واحد EnumeratorRunner.Run برای اکشن‌ها، تسک‌های ناهمزمان و نتایج',
        'اجرای تأخیری با پارامتر زمان',
        'پشتیبانی از مهلت زمانی برای رها کردن تسک‌های طولانی',
        'اجرا روی ترد اصلی برای حفظ امنیت فراخوانی‌های API یونیتی',
        'نصب از طریق Unity Package Manager از یک آدرس git'
      ],
      facts: [['نوع', 'پکیج قابل‌استفاده‌مجدد'], ['شامل', 'تسک‌های تأخیری و همزمان'], ['ایمنی', 'پشتیبانی از مهلت زمانی']],
      sourceLabel: 'مشاهده در گیت‌هاب'
    },
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
    fa: {
      category: 'پکیج یونیتی / UI',
      eyebrow: 'مسیری تمیزتر میان منوها',
      description: 'ابزار مدیریت منوی یونیتی برای ساخت ویوها، جابه‌جایی بین آن‌ها و مدیریت ناوبری در چند لایه.',
      paragraphs: [
        'منیوویو سیم‌کشی تکراری منوها را با یک مدل ویو متمرکز جایگزین می‌کند. یک منو از MenuView ارث‌بری می‌کند، کنترل‌های خودش را مقداردهی می‌کند و از فرمان‌های مشترک برای رفتن به ویوی دیگر یا بازگشت به ویوی قبلی استفاده می‌کند.',
        'پکیج عمداً کوچک است: واژگان ناوبری قابل پیش‌بینی به جریان‌های UI می‌دهد و هر پروژه را در تعریف صفحه‌ها و طراحی تعاملی خودش آزاد می‌گذارد.'
      ],
      storyKicker: 'رابط',
      storyTitle: ['هر ویو', 'به راهی', 'برای پیش‌روی نیاز دارد.'],
      techKicker: 'یادداشت‌هایی از ساخت',
      techTitle: ['یک مدل ویو', 'برای هر', 'جریان منو.'],
      technical: [
        'منیوویو سیم‌کشی تکراری منوها را با یک مدل ویو کوچک جایگزین می‌کند. اسکریپت منو از MenuView ارث‌بری می‌کند، کنترل‌های خودش را در Init() مقداردهی می‌کند و از فرمان‌های مشترک برای جابه‌جایی بین ویوها یا بازگشت در تاریخچه ناوبری استفاده می‌کند.',
        'پکیج فرمان‌های استاتیکی مثل ChangeCurrentView<T>() و ChangeToLastView() را ارائه می‌دهد تا حرکت بین صفحه‌ها یک عملیات تایپ‌شده و قابل پیش‌بینی شود. از طریق Unity Package Manager و آدرس git نصب می‌شود.'
      ],
      techPoints: [
        'کلاس پایه MenuView با هوک Init() برای هر صفحه',
        'ChangeCurrentView<T>() برای ناوبری تایپ‌شده',
        'ChangeToLastView() با تاریخچه ویو لایه‌ای',
        'فرمان‌های استاتیک محل فراخوانی را از سیم‌کشی آزاد می‌کنند',
        'نصب از طریق Unity Package Manager از آدرس git'
      ],
      facts: [['نوع', 'پکیج قابل‌استفاده‌مجدد'], ['API اصلی', 'ChangeCurrentView()'], ['الگو', 'تاریخچه ویو لایه‌ای']],
      sourceLabel: 'مشاهده در گیت‌هاب'
    },
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
    fa: {
      category: 'نرم‌افزار / شبکه',
      eyebrow: 'زیرساخت پروکسی از ترمینال',
      description: 'کلاینت خط فرمان V2Ray و مدیر پروکسی برای sing-box و Xray-core، چندسکویی و بدون واسط گرافیکی.',
      paragraphs: [
        'وی‌توپورتال کل مسیر را از پروفایل پروکسی تا این‌باند محلی مدیریت می‌کند. سابسکریپشن‌ها و لینک‌های اشتراک‌گذاری را وارد می‌کند، از پروفایل‌ها و گروه‌ها پشتیبانی می‌کند، سرورهای SOCKS5 یا HTTP پایدار اجرا می‌کند و مسیریابی تفکیکی مبتنی بر قانون ارائه می‌دهد.',
        'این ابزار برای ترمینال‌ها، اتوماسیون، سرورها، آزمایشگاه‌های خانگی و اشتراک پروکسی در شبکه محلی ساخته شده است. تنظیمات را محلی ذخیره می‌کند، از چند پروتکل پروکسی پشتیبانی می‌کند و تنظیمات سراسری سیستم را دست‌نخورده نگه می‌دارد.'
      ],
      storyKicker: 'شبکه',
      storyTitle: ['مسیرها', 'انتخاب‌هایی', 'در حرکت‌اند.'],
      techKicker: 'یادداشت‌هایی از ساخت',
      techTitle: ['یک CLI،', 'دو موتور', 'پروکسی.'],
      technical: [
        'وی‌توپورتال یک کلاینت خط فرمان V2Ray بدون واسط گرافیکی است که کل مسیر را از سابسکریپشن تا این‌باند محلی مدیریت می‌کند. سابسکریپشن‌ها و لینک‌های اشتراک‌گذاری را وارد می‌کند، آن‌ها را به پروفایل تبدیل می‌کند، با استراتژی‌های بالانس یا زنجیره‌ای گروه‌بندی می‌کند و این‌باندهای پایدار SOCKS5، HTTP یا ترکیبی را با مسیریابی تفکیکی مبتنی بر قانون اجرا می‌کند.',
        'sing-box موتور پیش‌فرض است و Xray-core به‌طور خودکار وقتی پروتکل یا استراتژی به آن نیاز داشته باشد انتخاب می‌شود؛ باینری‌های موتور در صورت نیاز دانلود می‌شوند. تنظیمات به‌صورت JSON محلی با بکاپ‌های چرخشی ذخیره می‌شوند و CLI برای اتوماسیون خروجی JSON و سرویس‌های بوت ارائه می‌دهد.'
      ],
      techPoints: [
        'پشتیبانی از دو موتور: sing-box پیش‌فرض، Xray-core هنگام نیاز',
        'وارد کردن سابسکریپشن و لینک اشتراک‌گذاری با به‌روزرسانی و هرس',
        'گروه‌های پروکسی با استراتژی‌های latency، random، round-robin و least-load',
        'زنجیره‌سازی پروکسی از طریق پرش‌های مرتب',
        'این‌باندهای پایدار SOCKS5 / HTTP / ترکیبی با مسیریابی تفکیکی',
        'تنظیمات JSON، بکاپ چرخشی و خروجی JSON برای اتوماسیون'
      ],
      facts: [['پلتفرم‌ها', 'لینوکس · ویندوز · مک · Termux'], ['حالت‌ها', 'گروه‌ها، زنجیره‌ها و مسیریابی تفکیکی'], ['وضعیت', 'پکیج PyPI']],
      sourceLabel: 'مشاهده در گیت‌هاب'
    },
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
    fa: {
      category: 'نرم‌افزار / شبکه',
      eyebrow: 'تصمیم بگیرید ترافیک به کجا تعلق دارد',
      description: 'یک CLI پایتون (نسخه آلفا) که اتصالات را از طریق چند outbound ساکس‌۵، HTTP CONNECT یا مستقیم با قوانین مسیریابی منعطف هدایت می‌کند.',
      paragraphs: [
        'پروکسی‌تیونر به‌عنوان لایه سیاست در برابر چند مسیر شبکه عمل می‌کند. قوانین می‌توانند دامنه‌ها، آی‌پی‌ها و محدوده‌های CIDR، پورت‌ها، نام فرایندها، مسیرها و عبارت‌های باقاعده را مطابقت دهند و اولویت‌های پایین‌تر اول ارزیابی می‌شوند.',
        'می‌تواند پروکسی محلی SOCKS5 و HTTP CONNECT اجرا کند، آپ‌استریم‌ها را تست کند، آمار گزارش دهد و در کنار وی‌توپورتال کار کند: وی‌توپورتال پروکسی‌های موجود را مدیریت می‌کند و پروکسی‌تیونر تصمیم می‌گیرد کدام ترافیک به کجا برود.'
      ],
      storyKicker: 'سیاست',
      storyTitle: ['قصد', 'outbound را', 'انتخاب می‌کند.'],
      techKicker: 'یادداشت‌هایی از ساخت',
      techTitle: ['قوانین تصمیم می‌گیرند', 'ترافیک', 'به کجا برود.'],
      technical: [
        'پروکسی‌تیونر لایه سیاست در برابر چند مسیر شبکه است. یک شنونده محلی کلاینت‌های SOCKS5 و HTTP CONNECT را روی همان پورت می‌پذیرد، هر اتصال را در برابر قوانین مرتب‌شده بر اساس اولویت ارزیابی می‌کند و بایت‌ها را از طریق outbound انتخابی — مستقیم، SOCKS5 یا HTTP CONNECT — رله می‌کند.',
        'قوانین مطابق‌گرها را با منطق AND داخل یک قانون و منطق OR داخل یک فیلد ترکیب می‌کنند: دامنه‌ها، آی‌پی‌ها و محدوده‌های CIDR، پورت‌ها، نام فرایندها و عبارت‌های باقاعده. این ابزار روی asyncio ساخته شده و رله دوجهته، تلاش مجدد، pooling، کش DNS و آمار per-outbound دارد — و با وی‌توپورتال، یک استک پروکسی کامل مبتنی بر قانون می‌سازد.'
      ],
      techPoints: [
        'یک شنونده با تشخیص خودکار پروتکل SOCKS5 / HTTP CONNECT',
        'قوانین مسیریابی مرتب بر اساس اولویت با تطبیق اول',
        'مطابق‌گرهای دامنه، آی‌پی / CIDR، پورت و فرایند با پشتیبانی regex',
        'ارسال مبتنی بر asyncio با pooling، تلاش مجدد و کش DNS',
        'احراز هویت اختیاری نام کاربری / رمز عبور روی پروکسی‌های آپ‌استریم',
        'مکمل وی‌توپورتال: آن پروکسی‌ها را مدیریت می‌کند، این ترافیک را مسیریابی می‌کند'
      ],
      facts: [['وضعیت', 'نرم‌افزار آلفا'], ['قوانین', 'اولویت و تطبیق اول'], ['جفت‌شده با', 'V2Portal']],
      sourceLabel: 'مشاهده در گیت‌هاب'
    },
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
    fa: {
      category: 'وب‌اپ / نرم‌افزار',
      eyebrow: 'اتاقی برای دیدار مردم بساز',
      description: 'برنامه وب واقع‌زمان شبیه Meetup برای ساخت و عضویت در جلسات فنی، با احراز هویت، به‌روزرسانی زنده حضار و کشف جلسات.',
      paragraphs: [
        'این برنامه یک فهرست جلسات قابل جست‌وجو را با جزئیات اجتماعی ترکیب می‌کند که یک نشست را زنده می‌کند: میزبان‌ها، شرکت‌کننده‌ها، برچسب‌ها، تقویم‌ها، خط زمانی رویداد و حالت تاریک.',
        'در زیر سطح، یک API اکسپرس با SQLite و Socket.IO جفت می‌شود و فرانت‌اند ری‌اکت و وایت آن تجربه را مدیریت می‌کند. Google OAuth، توکن‌های دسترسی و بازخوانی JWT و یک مجموعه تست خودکار گسترده، نمونه اولیه را در دغدغه‌های واقعی محصول نگه می‌دارند.'
      ],
      storyKicker: 'محصول',
      storyTitle: ['یک اتاق', 'به یک', 'جامعه تبدیل می‌شود.'],
      techKicker: 'یادداشت‌هایی از ساخت',
      techTitle: ['یک استک واقعی‌زمان،', 'تست‌شده', 'سرتاسری.'],
      technical: [
        'برنامه یک بک‌اند Express 5 / تایپ‌اسکریپت را با فرانت‌اند ری‌اکت ۱۸ جفت می‌کند. SQLite با better-sqlite3 جلسات و کاربران را ذخیره می‌کند، Socket.IO به‌روزرسانی‌های زنده شرکت‌کننده و جلسه را می‌فرستد و Google OAuth توکن‌های دسترسی و بازخوانی JWT صادر می‌کند.',
        'ریپازیتوری به سه بخش بک‌اند، فرانت‌اند و سویت‌های E2E پلی‌رایت تقسیم شده است: بیش از ۸۴ تست بک‌اند با Vitest و Supertest، بیش از ۵۲ تست فرانت‌اند با Testing Library و جریان‌های کامل مرورگر برای احراز هویت، جلسات، شرکت‌کننده‌ها و بلادرنگ. دو اسکریپت — dev و prod — کل استک را با یک ویزارد محیطی درون‌خطی راه‌اندازی می‌کنند.'
      ],
      techPoints: [
        'API REST اکسپرس ۵ + تایپ‌اسکریپت با اعتبارسنجی محیطی Zod',
        'SQLite با better-sqlite3 و مهاجرت‌ها',
        'Socket.IO برای شمار شرکت‌کننده زنده و به‌روزرسانی جلسه',
        'Google OAuth 2.0 با توکن‌های دسترسی / بازخوانی JWT',
        'فرانت‌اند ری‌اکت ۱۸ + Vite + Tailwind با کلاینت API دارای بازخوانی توکن',
        'بیش از ۸۴ تست بک‌اند، ۵۲ تست فرانت‌اند و تست‌های E2E پلی‌رایت'
      ],
      facts: [['بلادرنگ', 'Socket.IO'], ['احراز هویت', 'Google OAuth 2.0 + JWT'], ['تست', 'Vitest · Playwright']],
      sourceLabel: 'مشاهده در گیت‌هاب'
    },
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
    fa: {
      category: 'ربات تلگرام / اتوماسیون',
      eyebrow: 'لینک‌ها را به آرشیوهای مفید تبدیل کن',
      description: 'ربات ماژولار تلگرام که فایل‌ها را از URL دانلود می‌کند، آرشیو 7z با رمز اختیاری می‌سازد و لینک دانلود مستقیم با انقضا ارائه می‌دهد.',
      paragraphs: [
        'ربات یک گردش‌کار کامل فایل را به چت می‌آورد: دانلود یک یا چند URL، آرشیو کردن آن‌ها، تقسیم فایل‌های بزرگ برای تلگرام، مرور فایل‌های اخیر میزبانی‌شده و پاک‌سازی خودکار فضای ذخیره‌سازی منقضی‌شده.',
        'تنظیمات، منطق دانلود و آرشیو، هندلرهای تلگرام و سرور فایل را از هم جدا می‌کند. پشتیبانی اختیاری aria2، رمزنگاری AES-256 آرشیو، کنترل دسترسی و گردش‌کارهای استقرار آن را به یک آزمایش سیستم‌های عملی تبدیل می‌کنند.'
      ],
      storyKicker: 'گردش‌کار',
      storyTitle: ['فایل‌ها', 'با سرعت چت', 'حرکت می‌کنند.'],
      techKicker: 'یادداشت‌هایی از ساخت',
      techTitle: ['یک خط لوله فایل', 'که در چت', 'زندگی می‌کند.'],
      technical: [
        'ربات URLها و آپلودها را به یک گردش‌کار کامل فایل در تلگرام تبدیل می‌کند: دانلود با aria2 با پشتیبانی اتصال چندگانه یا HTTP مستقیم، بسته‌بندی همه چیز در آرشیو 7z با رمزنگاری اختیاری AES-256 و ارائه لینک دانلود مستقیم با انقضا از طریق یک سرور HTTP داخلی.',
        'کدبیس ماژولار است — تنظیمات، منطق هسته، هندلرهای تلگرام و سرور فایل پکیج‌های جدا هستند — با تنظیمات مبتنی بر .env، لیست سفید کنترل دسترسی، پاک‌سازی خودکار فایل‌های منقضی و گردش‌کارهای GitHub Actions برای استقرار، بکاپ و بررسی سلامت.'
      ],
      techPoints: [
        'دانلود چنداتصال‌ه aria2 با جایگزین HTTP مستقیم',
        'آرشیو 7z با حفاظت رمز اختیاری AES-256',
        'سرور HTTP داخلی با انقضای قابل‌تنظیم فایل',
        'تقسیم خودکار فایل‌های بزرگ برای محدودیت‌های تلگرام',
        'چیدمان ماژولار config / core / handlers / services',
        'CI/CD گیت‌هاب اکشن با استقرار، بکاپ و بررسی سلامت'
      ],
      facts: [['ورودی', 'URL یا فایل آپلودشده'], ['خروجی', 'آرشیو 7z یا لینک مستقیم'], ['نگهداری', 'انقضای قابل‌تنظیم']],
      sourceLabel: 'مشاهده در گیت‌هاب'
    },
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
    fa: {
      category: 'شبکه / HTTP',
      eyebrow: 'مسیری پژوهشی از دل HTTP',
      description: 'اثبات مفهوم آزمایشی که ترافیک TCP و UDP را برای شبکه‌های محدودشده فقط-HTTP از طریق درخواست‌های HTTP POST عبور می‌دهد.',
      paragraphs: [
        'اچ‌تی‌تی‌پی-تونل به برنامه‌ها یک نقطه ورودی محلی SOCKS5 می‌دهد، ترافیک را در درخواست‌های HTTP POST رمزشده می‌پیچد و پاسخ‌ها را از طریق بدنه HTTP برمی‌گرداند. شامل حل DNS سمت سرور، فشرده‌سازی، keep-alive تطبیقی، pooling اتصال، بازیابی نشست و پشتیبانی UDP است.',
        'پروژه صراحتاً آموزشی است و برای تولید آماده نیست. مستنداتش به رمزنگاری پایه ممیزی‌نشده، احتمال قرارگیری در معرض man-in-the-middle، سربار تأخیر و نیاز به استفاده فقط در شبکه‌هایی که تست در آن‌ها مجاز است اشاره می‌کند.'
      ],
      storyKicker: 'آزمایش',
      storyTitle: ['راهی', 'از باریک‌ترین', 'دروازه پیدا کن.'],
      techKicker: 'یادداشت‌هایی از ساخت',
      techTitle: ['TCP روی', 'HTTP POST،', 'به‌عنوان پژوهش.'],
      technical: [
        'اچ‌تی‌تی‌پی-تونل اثبات مفهومی است که ترافیک TCP و UDP را برای شبکه‌هایی که فقط HTTP مجاز است داخل درخواست‌های HTTP POST حمل می‌کند. یک پروکسی محلی SOCKS5 ترافیک برنامه را می‌پذیرد، آن را در POSTهای رمزشده می‌پیچد و سروری در راه دور آن را باز می‌کند و به مقصد واقعی متصل می‌شود.',
        'پکیج ماژول‌های رمزنگاری، فشرده‌سازی، پروتکل، استریم، سرور و کلاینت را جدا می‌کند. فشرده‌سازی zlib، keep-alive تطبیقی، pooling اتصال، اولویت QoS برای پورت‌های تعاملی، بازیابی نشست، حل DNS سمت سرور و رله UDP اضافه می‌کند — در حالی که README صریح است که رمزنگاری ممیزی‌نشده و ابزار برای استفاده تولیدی نیست.'
      ],
      techPoints: [
        'پروکسی کلاینت SOCKS5 با تونل از طریق بدنه‌های HTTP/1.1 POST',
        'رله TCP و UDP با حل DNS سمت سرور',
        'فشرده‌سازی zlib و keep-alive تطبیقی برای کاهش سربار',
        'بازیابی نشست با تلاش مجدد و backoff نمایی',
        'پکیج ماژولار: crypto، compression، protocol، stream، client، server',
        'صراحتاً آزمایشی — رمزنگاری ممیزی‌نشده، آماده تولید نیست'
      ],
      facts: [['وضعیت', 'آزمایشی / پژوهشی'], ['حمل‌ونقل', 'HTTP/1.1 POST'], ['هشدار', 'مناسب استفاده تولیدی نیست']],
      sourceLabel: 'مشاهده در گیت‌هاب'
    },
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
    fa: {
      category: 'ربات تلگرام / اتوماسیون',
      eyebrow: 'شبکه اجتماعی را به گردش‌کار چت بیاور',
      description: 'ربات آموزشی تلگرام که پست‌ها، ریلز، استوری‌ها و عکس پروفایل اینستاگرام را با gallery-dl، I/O ناهمزمان، کش و آپلود دسته‌ای دانلود می‌کند.',
      paragraphs: [
        'ربات یک لینک اینستاگرام را به جریان تحویل تلگرام تبدیل می‌کند. پست‌های کاروسل به گروه‌های رسانه‌ای تبدیل می‌شوند، ریلز به ویدیو و دانلودهای کش‌شده بدون تکرار کار دوباره ارسال می‌شوند.',
        'همچنین جزئیات عملیاتی اتوماسیون را کاوش می‌کند: کوکی‌های per-user، لیست سفید، قفل دانلود، پاک‌سازی کش، محدودیت نرخ و محدودیت‌های عملی گروه‌های رسانه‌ای تلگرام.'
      ],
      storyKicker: 'خط لوله',
      storyTitle: ['ضبط.', 'کش.', 'تحویل.'],
      techKicker: 'یادداشت‌هایی از ساخت',
      techTitle: ['ضبط.', 'کش.', 'تحویل.'],
      technical: [
        'ربات یک لینک اینستاگرام را به جریان تحویل تلگرام تبدیل می‌کند و از gallery-dl برای استخراج و I/O ناهمزمان در سراسر آن استفاده می‌کند. پست‌های کاروسل گروه‌های رسانه‌ای می‌شوند، ریلز ویدیو، استوری‌ها و عکس پروفایل در صورت نیاز دانلود می‌شوند و هر نتیجه کش می‌شود تا ارسال مجدد هرگز کار را تکرار نکند.',
        'جزئیات عملیاتی صریح مدیریت می‌شوند: کوکی‌های per-user با اعتبارسنجی، لیست سفید برای کنترل دسترسی، قفل‌های دانلود که از کار تکراری جلوگیری می‌کنند، پاک‌سازی خودکار قابل‌تنظیم فایل‌های ذخیره‌شده و دسته‌بندی که به محدودیت ده‌تایی گروه رسانه‌ای تلگرام احترام می‌گذارد.'
      ],
      techPoints: [
        'استخراج gallery-dl برای پست‌ها، ریلز، استوری‌ها و عکس پروفایل',
        'I/O ناهمزمان با آپلود دسته‌ای گروه رسانه‌ای (تا ۱۰ مورد)',
        'کش دانلود پایدار با پشتیبانی ارسال مجدد',
        'ذخیره کوکی per-user با اعتبارسنجی',
        'قفل دانلود از کار همزمان تکراری جلوگیری می‌کند',
        'لیست سفید کنترل دسترسی و پاک‌سازی خودکار فایل‌های منقضی'
      ],
      facts: [['رسانه', 'پست · ریلز · استوری'], ['دسته‌بندی', 'تا ۱۰ مورد در هر گروه'], ['وضعیت', 'پروژه آموزشی']],
      sourceLabel: 'مشاهده در گیت‌هاب'
    },
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
    fa: {
      category: 'ربات تلگرام / اتوماسیون',
      eyebrow: 'جعبه‌ابزار رسانه در تلگرام',
      description: 'ربات دانلود یوتیوب برای تلگرام با پشتیبانی از ویدیو، صدا، بندانگشتی، زیرنویس، انتخاب فرمت، کش و لینک مستقیم.',
      paragraphs: [
        'تلگرام یوتیوب انتخاب‌های رسانه‌ای را صریح می‌کند: کیفیت ویدیو، فرمت صدا، بندانگشتی یا رفتار زیرنویس را انتخاب کنید و سپس تصمیم بگیرید نتیجه به تلگرام آپلود شود یا به‌صورت لینک دانلود ارائه شود.',
        'پروژه yt-dlp، FFmpeg در جاهای لازم، Deno برای استخراج، سرور فایل aiohttp، مدیریت کوکی، حالت اینلاین، توکن‌های دیپ‌لینک و پاک‌سازی خودکار را در یک فرایند مستقل جمع می‌کند.'
      ],
      storyKicker: 'جعبه‌ابزار',
      storyTitle: ['فرمت‌های بیشتر،', 'یک گفت‌وگو', 'ساده.'],
      techKicker: 'یادداشت‌هایی از ساخت',
      techTitle: ['هر فرمت،', 'یک', 'گفت‌وگو.'],
      technical: [
        'تلگرام یوتیوب انتخاب‌های رسانه‌ای را صریح می‌کند: کیفیت ویدیو، فرمت صدا، بندانگشتی و رفتار زیرنویس همگی قابل انتخاب هستند و نتیجه می‌تواند به تلگرام آپلود شود یا به‌عنوان لینک دانلود مستقیم ارائه شود. استخراج با yt-dlp و Deno برای یوتیوب انجام می‌شود و FFmpeg تبدیل و جاسازی زیرنویس را مدیریت می‌کند.',
        'کل سرویس یک فرایند مستقل است: سرور فایل aiohttp دانلودها را سرو می‌کند، کوکی‌ها فقط در RAM نگه داشته می‌شوند، دانلودهای تکراری بر اساس واریانت تشخیص داده می‌شوند و حالت اینلاین به‌همراه توکن‌های دیپ‌لینک به مردم اجازه می‌دهند محتوا را خارج از چت ربات به اشتراک بگذارند. صدای Opus برای تلویزیون‌های هوشمند خودکار به AAC تبدیل می‌شود.'
      ],
      techPoints: [
        'استخراج yt-dlp با رانتایم Deno برای یوتیوب',
        'انتخاب کیفیت per-variant: ویدیو، صدا، بندانگشتی، زیرنویس',
        'دو مسیر تحویل: آپلود تلگرام یا لینک دانلود مستقیم',
        'سرور فایل داخلی aiohttp با HTTPS بومی اختیاری',
        'تشخیص تکراری بر اساس واریانت فرمت',
        'کوکی‌ها فقط در RAM؛ تبدیل Opus به AAC برای تلویزیون‌های هوشمند'
      ],
      facts: [['فرمت‌ها', 'ویدیو · صدا · بندانگشتی'], ['تحویل', 'آپلود تلگرام یا لینک'], ['وضعیت', 'پروژه آموزشی']],
      sourceLabel: 'مشاهده در گیت‌هاب'
    },
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
