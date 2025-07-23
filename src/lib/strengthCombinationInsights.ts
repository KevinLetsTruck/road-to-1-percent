interface CombinationInsight {
  strengths: string[];
  watchOuts: string[];
  leverageTips: string[];
}

export const strengthCombinationInsights: Record<string, CombinationInsight> = {
  // Pioneer Combinations
  "Pioneer + Influencer": {
    strengths: [
      "Drives industry change through people-first innovation",
      "Gets buy-in for new ideas before competitors catch on",
      "Attracts top talent excited about the future",
      "Builds movements, not just businesses"
    ],
    watchOuts: [
      "May sell the vision before it's fully tested",
      "Could overpromise on revolutionary changes",
      "Might lose followers if innovations don't deliver quickly",
      "Risk of being seen as all talk, no action"
    ],
    leverageTips: [
      "Launch pilot programs with key influencer customers",
      "Document innovation wins to build credibility",
      "Create an advisory board of industry leaders",
      "Use your influence to get early adoption of new tech"
    ]
  },
  
  "Pioneer + Creator": {
    strengths: [
      "Turns visionary ideas into working systems",
      "Builds innovative solutions others can't copy",
      "Creates intellectual property and competitive moats",
      "Develops tomorrow's industry standards today"
    ],
    watchOuts: [
      "May get stuck in endless development cycles",
      "Could build solutions looking for problems",
      "Might neglect current operations for future projects",
      "Risk of over-engineering simple needs"
    ],
    leverageTips: [
      "Set strict MVP timelines for innovations",
      "Test new ideas with small customer segments",
      "Patent or protect your unique processes",
      "Partner with established players to scale innovations"
    ]
  },

  "Pioneer + Advisor": {
    strengths: [
      "Makes calculated bets on future trends",
      "Combines vision with data-driven validation",
      "Guides industry toward smarter innovation",
      "Sees opportunities others miss through analysis"
    ],
    watchOuts: [
      "Analysis paralysis on new opportunities",
      "May intellectualize rather than execute",
      "Could miss time-sensitive opportunities",
      "Risk of being right too early for market"
    ],
    leverageTips: [
      "Create decision frameworks for innovation",
      "Share thought leadership to attract partners",
      "Use data to prove innovative concepts",
      "Build strategic alliances for market entry"
    ]
  },

  "Pioneer + Connector": {
    strengths: [
      "Opens doors to new markets through relationships",
      "Builds innovation ecosystems and partnerships",
      "Gets early access to opportunities via network",
      "Creates collaborative innovations with others"
    ],
    watchOuts: [
      "May rely too much on others for execution",
      "Could leak innovative ideas through network",
      "Might lose focus jumping between opportunities",
      "Risk of shallow implementation across many ideas"
    ],
    leverageTips: [
      "Form strategic innovation partnerships",
      "Use network to validate ideas quickly",
      "Create exclusive pilot programs with key connections",
      "Build innovation advisory groups"
    ]
  },

  "Pioneer + Stimulator": {
    strengths: [
      "Creates contagious excitement for new ideas",
      "Pushes through resistance to change",
      "Motivates teams to embrace innovation",
      "Maintains momentum during difficult transitions"
    ],
    watchOuts: [
      "May push too hard too fast",
      "Could burn out team with constant change",
      "Might create change fatigue in organization",
      "Risk of enthusiasm outpacing preparation"
    ],
    leverageTips: [
      "Celebrate small innovation wins publicly",
      "Create innovation challenges for team",
      "Balance revolutionary and evolutionary changes",
      "Use energy to overcome implementation hurdles"
    ]
  },

  "Pioneer + Teacher": {
    strengths: [
      "Educates market on new possibilities",
      "Builds adoption through understanding",
      "Creates training for innovative approaches",
      "Develops next generation of innovators"
    ],
    watchOuts: [
      "May spend too much time explaining vs doing",
      "Could give away competitive advantages",
      "Might move too slowly for fast-changing markets",
      "Risk of teaching competitors your innovations"
    ],
    leverageTips: [
      "Create educational content around innovations",
      "Build certification programs for new methods",
      "Use teaching to establish thought leadership",
      "Develop internal innovation training programs"
    ]
  },

  "Pioneer + Provider": {
    strengths: [
      "Delivers reliable innovation customers can trust",
      "Ensures new ideas actually help people",
      "Builds sustainable long-term innovations",
      "Creates safety nets for innovation risks"
    ],
    watchOuts: [
      "May play it too safe with innovations",
      "Could prioritize stability over breakthrough",
      "Might miss disruptive opportunities",
      "Risk of incremental vs transformational change"
    ],
    leverageTips: [
      "Focus on innovations that reduce customer risk",
      "Build reliability into every new service",
      "Create innovation warranties or guarantees",
      "Use provider instincts to make innovations stick"
    ]
  },

  "Pioneer + Equalizer": {
    strengths: [
      "Creates innovations that benefit everyone",
      "Ensures fair access to new technologies",
      "Builds inclusive innovation strategies",
      "Develops democratic business models"
    ],
    watchOuts: [
      "May sacrifice profitability for fairness",
      "Could move slowly ensuring all voices heard",
      "Might miss first-mover advantages",
      "Risk of watering down innovations for consensus"
    ],
    leverageTips: [
      "Create cooperative innovation models",
      "Build platforms that empower small operators",
      "Use fairness as a unique selling proposition",
      "Develop innovations that level playing fields"
    ]
  },

  // Influencer Combinations
  "Influencer + Pioneer": {
    strengths: [
      "Rallies people around revolutionary change",
      "Makes innovation feel accessible and exciting",
      "Builds tribes of early adopters",
      "Creates market pull for new ideas"
    ],
    watchOuts: [
      "May create hype before substance",
      "Could disappoint followers with failed innovations",
      "Might focus on sexy vs practical innovations",
      "Risk of personality overshadowing product"
    ],
    leverageTips: [
      "Build community around your innovations",
      "Use influence to get beta testers",
      "Create innovation storytelling campaigns",
      "Leverage followers for market research"
    ]
  },

  "Influencer + Connector": {
    strengths: [
      "Masters the art of strategic introductions",
      "Creates powerful alliance networks",
      "Builds influence through authentic relationships",
      "Multiplies impact through connected influence"
    ],
    watchOuts: [
      "May become overwhelmed by relationships",
      "Could lose authenticity managing many connections",
      "Might become political rather than productive",
      "Risk of shallow relationships at scale"
    ],
    leverageTips: [
      "Host exclusive industry networking events",
      "Create mastermind groups for top clients",
      "Build referral programs leveraging both strengths",
      "Use connections to amplify influence campaigns"
    ]
  },

  "Influencer + Creator": {
    strengths: [
      "Builds solutions people actually want",
      "Creates viral products through influence",
      "Develops with built-in market validation",
      "Turns followers into co-creators"
    ],
    watchOuts: [
      "May prioritize popularity over functionality",
      "Could get distracted by follower requests",
      "Might build for influence rather than profit",
      "Risk of feature creep from too much input"
    ],
    leverageTips: [
      "Crowdsource product development ideas",
      "Build in public to maintain engagement",
      "Create exclusive products for loyal followers",
      "Use influence to beta test creations"
    ]
  },

  "Influencer + Advisor": {
    strengths: [
      "Provides trusted guidance people follow",
      "Combines charisma with credibility",
      "Influences through wisdom and expertise",
      "Builds thought leadership platforms"
    ],
    watchOuts: [
      "May come across as preachy or know-it-all",
      "Could struggle balancing likability with truth",
      "Might avoid unpopular but necessary advice",
      "Risk of echo chambers with followers"
    ],
    leverageTips: [
      "Create educational content series",
      "Build consulting offerings for followers",
      "Use data to support influential messages",
      "Balance inspiration with information"
    ]
  },

  "Influencer + Stimulator": {
    strengths: [
      "Creates unstoppable momentum and energy",
      "Builds excitement that spreads virally",
      "Motivates at scale through charisma",
      "Turns customers into passionate advocates"
    ],
    watchOuts: [
      "May burn bright but burn out quickly",
      "Could create unsustainable expectations",
      "Might attract followers for wrong reasons",
      "Risk of style over substance"
    ],
    leverageTips: [
      "Channel energy into sustained campaigns",
      "Create movement-based business models",
      "Build energy management systems",
      "Use enthusiasm strategically, not constantly"
    ]
  },

  "Influencer + Teacher": {
    strengths: [
      "Makes complex topics accessible and engaging",
      "Builds loyal following through education",
      "Creates influential educational platforms",
      "Develops industry-changing curricula"
    ],
    watchOuts: [
      "May oversimplify for mass appeal",
      "Could create dependent follower relationships",
      "Might prioritize teaching over doing",
      "Risk of becoming guru rather than practitioner"
    ],
    leverageTips: [
      "Build educational product lines",
      "Create certification programs",
      "Use influence to spread best practices",
      "Develop teaching-based revenue streams"
    ]
  },

  "Influencer + Provider": {
    strengths: [
      "Builds trust through consistent delivery",
      "Creates loyal followings through service",
      "Influences by example and action",
      "Develops reputation for reliability"
    ],
    watchOuts: [
      "May overcommit to please followers",
      "Could sacrifice margins for reputation",
      "Might struggle with necessary tough decisions",
      "Risk of being taken advantage of"
    ],
    leverageTips: [
      "Build service packages for loyal followers",
      "Create VIP tiers for top supporters",
      "Use reliability to strengthen influence",
      "Develop recurring revenue from trust"
    ]
  },

  "Influencer + Equalizer": {
    strengths: [
      "Champions fairness and justice authentically",
      "Builds movements for positive change",
      "Creates inclusive influential platforms",
      "Influences toward ethical practices"
    ],
    watchOuts: [
      "May alienate those benefiting from status quo",
      "Could limit growth fighting every injustice",
      "Might attract critics and opposition",
      "Risk of platform becoming political"
    ],
    leverageTips: [
      "Build cause-based business models",
      "Create fair trade freight networks",
      "Use influence for industry reform",
      "Develop cooperative business structures"
    ]
  },

  // Creator Combinations
  "Creator + Pioneer": {
    strengths: [
      "Builds the future while others talk about it",
      "Creates breakthrough solutions ahead of market",
      "Develops innovations with staying power",
      "Turns vision into scalable reality"
    ],
    watchOuts: [
      "May build too far ahead of market readiness",
      "Could get lost in possibilities vs priorities",
      "Might create solutions without clear problems",
      "Risk of perfectionism delaying launch"
    ],
    leverageTips: [
      "Focus on MVP versions of innovations",
      "Build with future scaling in mind",
      "Create modular solutions for flexibility",
      "Partner with implementers for rollout"
    ]
  },

  "Creator + Advisor": {
    strengths: [
      "Builds strategically sound solutions",
      "Creates with deep market understanding",
      "Develops data-driven innovations",
      "Combines creativity with analytical rigor"
    ],
    watchOuts: [
      "May overthink instead of shipping",
      "Could build overly complex solutions",
      "Might miss market timing analyzing",
      "Risk of feature creep from insights"
    ],
    leverageTips: [
      "Use advisory skills to validate builds",
      "Create solutions addressing real data",
      "Build analytical tools into products",
      "Develop consulting around creations"
    ]
  },

  "Creator + Connector": {
    strengths: [
      "Builds through collaborative innovation",
      "Creates network-effect solutions",
      "Develops with built-in distribution",
      "Leverages connections for resources"
    ],
    watchOuts: [
      "May lose focus with too many inputs",
      "Could compromise vision for partnerships",
      "Might delay building while networking",
      "Risk of IP issues with collaborators"
    ],
    leverageTips: [
      "Build platforms that connect others",
      "Create partnership-friendly solutions",
      "Use network for rapid prototyping",
      "Develop collaborative revenue models"
    ]
  },

  "Creator + Stimulator": {
    strengths: [
      "Builds with infectious enthusiasm",
      "Creates momentum around developments",
      "Energizes teams through building process",
      "Maintains drive through obstacles"
    ],
    watchOuts: [
      "May rush builds in excitement",
      "Could overpromise on timelines",
      "Might skip important details",
      "Risk of burnout from intense creation"
    ],
    leverageTips: [
      "Channel energy into sprint builds",
      "Create excitement milestones",
      "Build enthusiasm into products",
      "Use stimulation for team productivity"
    ]
  },

  "Creator + Teacher": {
    strengths: [
      "Builds educational and self-explanatory solutions",
      "Creates while developing others' skills",
      "Develops training alongside products",
      "Makes complex creations accessible"
    ],
    watchOuts: [
      "May overbuild for teaching purposes",
      "Could slow down explaining everything",
      "Might create unnecessary complexity",
      "Risk of giving away competitive advantages"
    ],
    leverageTips: [
      "Build training into product offerings",
      "Create educational product tiers",
      "Develop certification programs",
      "Use teaching to improve products"
    ]
  },

  "Creator + Provider": {
    strengths: [
      "Builds reliable, user-focused solutions",
      "Creates with sustainability in mind",
      "Develops dependable long-term systems",
      "Ensures creations serve real needs"
    ],
    watchOuts: [
      "May overbuild for edge cases",
      "Could sacrifice innovation for reliability",
      "Might move too slowly ensuring perfection",
      "Risk of feature bloat from caregiving"
    ],
    leverageTips: [
      "Focus on reliability as key feature",
      "Build maintenance into pricing",
      "Create solutions reducing user burden",
      "Develop support systems alongside products"
    ]
  },

  "Creator + Equalizer": {
    strengths: [
      "Builds fair and inclusive solutions",
      "Creates systems benefiting all stakeholders",
      "Develops democratic platforms",
      "Ensures equal access to innovations"
    ],
    watchOuts: [
      "May sacrifice efficiency for fairness",
      "Could overcomplicate ensuring equality",
      "Might limit profitability with inclusive pricing",
      "Risk of slow decisions seeking consensus"
    ],
    leverageTips: [
      "Build fairness as competitive advantage",
      "Create transparent pricing models",
      "Develop cooperative ownership structures",
      "Use equality to attract values-driven customers"
    ]
  },

  // Advisor Combinations
  "Advisor + Pioneer": {
    strengths: [
      "Provides wisdom for navigating new territories",
      "Combines foresight with strategic thinking",
      "Guides innovation with experience",
      "Sees future trends others miss"
    ],
    watchOuts: [
      "May give advice on untested areas",
      "Could be too theoretical about innovation",
      "Might hesitate between advising and pioneering",
      "Risk of analysis preventing action"
    ],
    leverageTips: [
      "Become the go-to expert on future trends",
      "Create strategic innovation frameworks",
      "Guide other pioneers with wisdom",
      "Build thought leadership platforms"
    ]
  },

  "Advisor + Influencer": {
    strengths: [
      "Combines expertise with charismatic delivery",
      "Builds trust through knowledge and likability",
      "Influences decisions with strategic wisdom",
      "Creates following around expertise"
    ],
    watchOuts: [
      "May struggle between popularity and truth",
      "Could water down advice for mass appeal",
      "Might become more personality than expert",
      "Risk of echo chambers with followers"
    ],
    leverageTips: [
      "Build authority-based influence",
      "Create premium advisory services",
      "Use influence to spread best practices",
      "Develop expertise-based content"
    ]
  },

  "Advisor + Creator": {
    strengths: [
      "Builds solutions based on deep expertise",
      "Creates with strategic understanding",
      "Develops tools solving real problems",
      "Combines wisdom with innovation"
    ],
    watchOuts: [
      "May overbuild based on edge cases",
      "Could create overly complex solutions",
      "Might advise more than create",
      "Risk of perfectionism from expertise"
    ],
    leverageTips: [
      "Build tools automating your expertise",
      "Create products from advisory insights",
      "Develop SaaS from consulting patterns",
      "Package wisdom into scalable solutions"
    ]
  },

  "Advisor + Connector": {
    strengths: [
      "Leverages network for strategic insights",
      "Connects people with precision and purpose",
      "Builds brain trusts and think tanks",
      "Creates value through strategic introductions"
    ],
    watchOuts: [
      "May spend too much time networking vs advising",
      "Could become broker more than expert",
      "Might lose depth maintaining connections",
      "Risk of conflicts of interest"
    ],
    leverageTips: [
      "Build exclusive advisory networks",
      "Create strategic partnership services",
      "Use connections for market intelligence",
      "Develop matchmaking expertise"
    ]
  },

  "Advisor + Stimulator": {
    strengths: [
      "Makes strategic guidance energizing",
      "Motivates while educating",
      "Creates enthusiasm for best practices",
      "Drives implementation of advice"
    ],
    watchOuts: [
      "May oversimplify complex strategies",
      "Could prioritize motivation over accuracy",
      "Might rush strategic processes",
      "Risk of style diluting substance"
    ],
    leverageTips: [
      "Create energizing strategic sessions",
      "Build momentum around implementations",
      "Use enthusiasm to drive change",
      "Develop action-oriented advisory"
    ]
  },

  "Advisor + Teacher": {
    strengths: [
      "Excellence in knowledge transfer",
      "Builds comprehensive learning systems",
      "Creates lasting expertise in others",
      "Develops industry education standards"
    ],
    watchOuts: [
      "May focus too much on theory",
      "Could create overly academic approaches",
      "Might teach more than implement",
      "Risk of creating dependent learners"
    ],
    leverageTips: [
      "Build educational consulting practices",
      "Create industry certification programs",
      "Develop train-the-trainer systems",
      "Package expertise into courses"
    ]
  },

  "Advisor + Provider": {
    strengths: [
      "Gives guidance with genuine care",
      "Provides sustainable long-term counsel",
      "Ensures advice serves best interests",
      "Builds trust through consistent support"
    ],
    watchOuts: [
      "May enable rather than empower",
      "Could give too much without boundaries",
      "Might avoid tough love advice",
      "Risk of burnout from overgiving"
    ],
    leverageTips: [
      "Create retainer advisory relationships",
      "Build support into service packages",
      "Develop long-term client partnerships",
      "Use care to deepen advisory impact"
    ]
  },

  "Advisor + Equalizer": {
    strengths: [
      "Provides balanced, unbiased counsel",
      "Ensures all perspectives considered",
      "Creates fair strategic frameworks",
      "Builds trust through impartiality"
    ],
    watchOuts: [
      "May overanalyze seeking perfect fairness",
      "Could delay decisions ensuring balance",
      "Might frustrate those wanting clear direction",
      "Risk of being too neutral to be helpful"
    ],
    leverageTips: [
      "Specialize in mediation and arbitration",
      "Create balanced scorecard systems",
      "Build reputation for fair dealing",
      "Develop inclusive strategy frameworks"
    ]
  },

  // Connector Combinations
  "Connector + Pioneer": {
    strengths: [
      "Opens doors to unexplored opportunities",
      "Builds networks in emerging markets",
      "Connects innovators with resources",
      "Creates first-mover network advantages"
    ],
    watchOuts: [
      "May connect before vetting opportunities",
      "Could spread network too thin chasing new",
      "Might burn bridges with failed innovations",
      "Risk of reputation if pioneering fails"
    ],
    leverageTips: [
      "Be the first connector in new markets",
      "Build innovation partner networks",
      "Connect pioneers with early adopters",
      "Create exclusive access opportunities"
    ]
  },

  "Connector + Influencer": {
    strengths: [
      "Maximizes reach through network effects",
      "Builds influential power networks",
      "Creates viral connection opportunities",
      "Leverages relationships exponentially"
    ],
    watchOuts: [
      "May prioritize quantity over quality",
      "Could become superficial networker",
      "Might lose authentic connections at scale",
      "Risk of transactional relationships"
    ],
    leverageTips: [
      "Host high-value networking events",
      "Create connection-based content",
      "Build influencer partnership programs",
      "Develop network monetization strategies"
    ]
  },

  "Connector + Creator": {
    strengths: [
      "Builds solutions enhancing connections",
      "Creates platforms bringing people together",
      "Develops network-powered innovations",
      "Leverages relationships for co-creation"
    ],
    watchOuts: [
      "May lose focus jumping between connections",
      "Could compromise creation for networking",
      "Might share ideas too freely",
      "Risk of IP issues in collaborations"
    ],
    leverageTips: [
      "Build networking platforms or tools",
      "Create collaborative business models",
      "Develop partnership-based solutions",
      "Use connections for rapid validation"
    ]
  },

  "Connector + Advisor": {
    strengths: [
      "Makes strategic connections with purpose",
      "Builds brain trust networks",
      "Creates value through curated introductions",
      "Leverages network for collective wisdom"
    ],
    watchOuts: [
      "May overthink connection strategies",
      "Could gatekeep valuable relationships",
      "Might analyze rather than connect",
      "Risk of conflicts advising competitors"
    ],
    leverageTips: [
      "Create strategic introduction services",
      "Build advisory network offerings",
      "Develop connection consulting",
      "Use network for market intelligence"
    ]
  },

  "Connector + Stimulator": {
    strengths: [
      "Creates high-energy networking experiences",
      "Builds enthusiastic communities",
      "Energizes networks for action",
      "Maintains vibrant relationship ecosystems"
    ],
    watchOuts: [
      "May burn out maintaining energy",
      "Could overwhelm contacts with enthusiasm",
      "Might prioritize exciting over valuable",
      "Risk of exhausting network patience"
    ],
    leverageTips: [
      "Create energizing networking formats",
      "Build momentum-based referral systems",
      "Use enthusiasm to activate dormant connections",
      "Develop high-energy partnership models"
    ]
  },

  "Connector + Teacher": {
    strengths: [
      "Educates while connecting people",
      "Builds learning networks and communities",
      "Creates knowledge-sharing ecosystems",
      "Develops others' networking abilities"
    ],
    watchOuts: [
      "May lecture instead of connect",
      "Could slow networking with education",
      "Might create dependent networkers",
      "Risk of overcomplicating connections"
    ],
    leverageTips: [
      "Build educational networking programs",
      "Create connection training services",
      "Develop peer learning networks",
      "Use teaching to add connection value"
    ]
  },

  "Connector + Provider": {
    strengths: [
      "Takes care of network relationships",
      "Builds lasting, supportive connections",
      "Creates nurturing business ecosystems",
      "Ensures mutual benefit in connections"
    ],
    watchOuts: [
      "May give too much without receiving",
      "Could enable dependent relationships",
      "Might sacrifice own needs for network",
      "Risk of burnout from overcare"
    ],
    leverageTips: [
      "Build reciprocal support networks",
      "Create care-based connection services",
      "Develop long-term relationship strategies",
      "Use providing to deepen connections"
    ]
  },

  "Connector + Equalizer": {
    strengths: [
      "Creates balanced, fair networks",
      "Ensures equal access to opportunities",
      "Builds inclusive connection ecosystems",
      "Facilitates win-win relationships"
    ],
    watchOuts: [
      "May slow connections ensuring fairness",
      "Could limit network to avoid imbalance",
      "Might overthink relationship dynamics",
      "Risk of missing opportunities while balancing"
    ],
    leverageTips: [
      "Build fair-trade business networks",
      "Create inclusive networking platforms",
      "Develop balanced referral systems",
      "Use fairness as networking differentiator"
    ]
  },

  // Stimulator Combinations
  "Stimulator + Pioneer": {
    strengths: [
      "Energizes breakthrough innovations",
      "Creates excitement for new possibilities",
      "Pushes boundaries with enthusiasm",
      "Maintains momentum through change"
    ],
    watchOuts: [
      "May create hype before readiness",
      "Could exhaust team with constant change",
      "Might rush innovation implementation",
      "Risk of enthusiasm masking problems"
    ],
    leverageTips: [
      "Channel energy into innovation sprints",
      "Create excitement checkpoints",
      "Build change management systems",
      "Use enthusiasm strategically"
    ]
  },

  "Stimulator + Influencer": {
    strengths: [
      "Creates contagious positive energy",
      "Builds movements through enthusiasm",
      "Influences through inspirational energy",
      "Motivates at scale effectively"
    ],
    watchOuts: [
      "May burn too bright too fast",
      "Could attract followers for energy alone",
      "Might struggle with sustainable pacing",
      "Risk of creating dependent followers"
    ],
    leverageTips: [
      "Build sustainable energy systems",
      "Create motivation-based programs",
      "Develop energy management strategies",
      "Use influence to spread positivity"
    ]
  },

  "Stimulator + Creator": {
    strengths: [
      "Builds with unstoppable enthusiasm",
      "Creates energy-infused solutions",
      "Maintains drive through obstacles",
      "Energizes creative processes"
    ],
    watchOuts: [
      "May rush creation in excitement",
      "Could prioritize energy over quality",
      "Might burn out from intense building",
      "Risk of incomplete projects"
    ],
    leverageTips: [
      "Use energy for rapid prototyping",
      "Create enthusiasm-driven products",
      "Build in energizing user experiences",
      "Channel stimulation into productivity"
    ]
  },

  "Stimulator + Advisor": {
    strengths: [
      "Makes strategy exciting and actionable",
      "Energizes implementation of advice",
      "Creates enthusiasm for best practices",
      "Motivates strategic thinking"
    ],
    watchOuts: [
      "May oversimplify for enthusiasm",
      "Could rush strategic planning",
      "Might prioritize action over analysis",
      "Risk of superficial advisory"
    ],
    leverageTips: [
      "Create action-oriented advisory",
      "Build enthusiasm into strategies",
      "Develop motivational consulting",
      "Use energy to drive implementation"
    ]
  },

  "Stimulator + Connector": {
    strengths: [
      "Creates vibrant networking energy",
      "Builds enthusiastic communities",
      "Energizes connections into action",
      "Maintains network momentum"
    ],
    watchOuts: [
      "May overwhelm network with energy",
      "Could burn out maintaining enthusiasm",
      "Might prioritize energy over value",
      "Risk of exhausting connections"
    ],
    leverageTips: [
      "Build high-energy networking events",
      "Create enthusiasm-based referrals",
      "Develop energizing partnership models",
      "Use stimulation to activate networks"
    ]
  },

  "Stimulator + Teacher": {
    strengths: [
      "Makes learning exciting and memorable",
      "Creates enthusiasm for education",
      "Energizes students and teams",
      "Builds engaging educational experiences"
    ],
    watchOuts: [
      "May prioritize entertainment over education",
      "Could rush through important concepts",
      "Might create surface-level learning",
      "Risk of style over substance"
    ],
    leverageTips: [
      "Build engaging educational programs",
      "Create enthusiasm-driven learning",
      "Develop memorable teaching methods",
      "Use energy to enhance retention"
    ]
  },

  "Stimulator + Provider": {
    strengths: [
      "Energizes while supporting others",
      "Creates enthusiastic care systems",
      "Maintains positivity during challenges",
      "Builds uplifting support networks"
    ],
    watchOuts: [
      "May exhaust self caring with energy",
      "Could mask problems with positivity",
      "Might burn out from double output",
      "Risk of unsustainable giving"
    ],
    leverageTips: [
      "Build sustainable support energy",
      "Create positive care experiences",
      "Develop energizing help systems",
      "Balance stimulation with rest"
    ]
  },

  "Stimulator + Equalizer": {
    strengths: [
      "Energizes fair and inclusive practices",
      "Creates enthusiasm for equality",
      "Builds positive change movements",
      "Maintains energy for justice"
    ],
    watchOuts: [
      "May oversimplify complex fairness issues",
      "Could alienate with zealous equality",
      "Might burn out fighting all battles",
      "Risk of performative rather than real change"
    ],
    leverageTips: [
      "Channel energy into specific causes",
      "Build enthusiasm for fair practices",
      "Create positive equality movements",
      "Use stimulation for sustainable change"
    ]
  },

  // Teacher Combinations
  "Teacher + Pioneer": {
    strengths: [
      "Educates market on innovations",
      "Builds adoption through understanding",
      "Creates knowledge around new concepts",
      "Develops future-focused curricula"
    ],
    watchOuts: [
      "May teach concepts before they're proven",
      "Could confuse with too much newness",
      "Might be ahead of learner readiness",
      "Risk of teaching competitors innovations"
    ],
    leverageTips: [
      "Create innovation education programs",
      "Build thought leadership content",
      "Develop future skills training",
      "Use teaching to drive adoption"
    ]
  },

  "Teacher + Influencer": {
    strengths: [
      "Makes education accessible and engaging",
      "Builds large learning communities",
      "Influences through knowledge sharing",
      "Creates viral educational content"
    ],
    watchOuts: [
      "May oversimplify for mass appeal",
      "Could prioritize popularity over depth",
      "Might create dependent learners",
      "Risk of edutainment over education"
    ],
    leverageTips: [
      "Build scalable education platforms",
      "Create influential learning content",
      "Develop teaching-based influence",
      "Use influence to spread knowledge"
    ]
  },

  "Teacher + Creator": {
    strengths: [
      "Builds comprehensive learning systems",
      "Creates educational tools and resources",
      "Develops while teaching others",
      "Makes complex builds understandable"
    ],
    watchOuts: [
      "May overbuild for teaching purposes",
      "Could slow creation with explanations",
      "Might create unnecessary complexity",
      "Risk of teaching more than doing"
    ],
    leverageTips: [
      "Build educational products",
      "Create learning management systems",
      "Develop teaching-integrated solutions",
      "Use creation to enhance teaching"
    ]
  },

  "Teacher + Advisor": {
    strengths: [
      "Combines education with strategic guidance",
      "Builds deep expertise in others",
      "Creates comprehensive knowledge transfer",
      "Develops strategic thinking abilities"
    ],
    watchOuts: [
      "May be too theoretical or academic",
      "Could overwhelm with information",
      "Might create analysis paralysis",
      "Risk of ivory tower disconnect"
    ],
    leverageTips: [
      "Build executive education programs",
      "Create strategic thinking courses",
      "Develop advisory teaching methods",
      "Use teaching to scale advisory"
    ]
  },

  "Teacher + Connector": {
    strengths: [
      "Builds learning networks and communities",
      "Connects students with opportunities",
      "Creates collaborative education",
      "Develops networking through teaching"
    ],
    watchOuts: [
      "May focus on networking over learning",
      "Could dilute teaching with connections",
      "Might create shallow learning experiences",
      "Risk of quantity over quality"
    ],
    leverageTips: [
      "Build peer learning networks",
      "Create educational communities",
      "Develop connection-based learning",
      "Use network to enhance education"
    ]
  },

  "Teacher + Stimulator": {
    strengths: [
      "Creates exciting learning experiences",
      "Maintains student engagement and energy",
      "Makes education memorable and fun",
      "Builds enthusiasm for learning"
    ],
    watchOuts: [
      "May prioritize fun over fundamentals",
      "Could create surface-level understanding",
      "Might exhaust learners with energy",
      "Risk of edutainment trap"
    ],
    leverageTips: [
      "Build engaging course designs",
      "Create memorable learning moments",
      "Develop enthusiasm-based retention",
      "Use energy to overcome learning barriers"
    ]
  },

  "Teacher + Provider": {
    strengths: [
      "Nurtures students through learning journey",
      "Provides comprehensive support systems",
      "Ensures no learner left behind",
      "Creates safe learning environments"
    ],
    watchOuts: [
      "May enable rather than educate",
      "Could create dependent learners",
      "Might sacrifice standards for support",
      "Risk of burnout from overcare"
    ],
    leverageTips: [
      "Build supportive learning systems",
      "Create inclusive education models",
      "Develop care-based teaching",
      "Use providing to deepen learning"
    ]
  },

  "Teacher + Equalizer": {
    strengths: [
      "Creates fair and inclusive education",
      "Ensures equal learning opportunities",
      "Builds balanced curricula",
      "Develops democratic teaching methods"
    ],
    watchOuts: [
      "May slow pace for inclusivity",
      "Could limit advanced learners",
      "Might overcomplicate for fairness",
      "Risk of lowest common denominator"
    ],
    leverageTips: [
      "Build inclusive learning platforms",
      "Create fair assessment systems",
      "Develop equal-access education",
      "Use fairness as teaching strength"
    ]
  },

  // Provider Combinations
  "Provider + Pioneer": {
    strengths: [
      "Delivers innovative solutions reliably",
      "Provides stable innovation platforms",
      "Ensures new ideas actually help",
      "Creates sustainable pioneering"
    ],
    watchOuts: [
      "May limit innovation for stability",
      "Could move too slowly for market",
      "Might miss disruptive opportunities",
      "Risk of incremental vs breakthrough"
    ],
    leverageTips: [
      "Focus on sustainable innovations",
      "Build reliable new services",
      "Create innovation safety nets",
      "Use providing to validate pioneering"
    ]
  },

  "Provider + Influencer": {
    strengths: [
      "Builds influence through consistent delivery",
      "Creates trust through reliable service",
      "Influences by example and care",
      "Develops loyal follower base"
    ],
    watchOuts: [
      "May overcommit to maintain influence",
      "Could sacrifice margins for reputation",
      "Might burn out serving everyone",
      "Risk of being taken advantage of"
    ],
    leverageTips: [
      "Build reputation on reliability",
      "Create VIP service tiers",
      "Develop care-based influence",
      "Use providing to deepen loyalty"
    ]
  },

  "Provider + Creator": {
    strengths: [
      "Builds solutions that truly serve",
      "Creates with user needs first",
      "Develops sustainable systems",
      "Ensures creations provide value"
    ],
    watchOuts: [
      "May overbuild for edge cases",
      "Could sacrifice innovation for safety",
      "Might move slowly ensuring perfection",
      "Risk of feature bloat"
    ],
    leverageTips: [
      "Build user-centric solutions",
      "Create with support built in",
      "Develop sustainable products",
      "Use providing to guide creation"
    ]
  },

  "Provider + Advisor": {
    strengths: [
      "Gives advice with genuine care",
      "Provides wisdom with support",
      "Ensures guidance serves best interests",
      "Builds trust through consistent help"
    ],
    watchOuts: [
      "May enable poor decisions",
      "Could avoid tough love advice",
      "Might burn out overgiving",
      "Risk of creating dependence"
    ],
    leverageTips: [
      "Build caring advisory services",
      "Create supportive consulting",
      "Develop long-term guidance",
      "Use care to enhance advice"
    ]
  },

  "Provider + Connector": {
    strengths: [
      "Nurtures network relationships",
      "Provides value to all connections",
      "Creates supportive ecosystems",
      "Ensures mutual benefit"
    ],
    watchOuts: [
      "May give without receiving",
      "Could enable one-sided relationships",
      "Might exhaust serving network",
      "Risk of attracting takers"
    ],
    leverageTips: [
      "Build reciprocal networks",
      "Create value-add connections",
      "Develop supportive communities",
      "Use providing to strengthen bonds"
    ]
  },

  "Provider + Stimulator": {
    strengths: [
      "Energizes while supporting",
      "Creates positive service experiences",
      "Maintains enthusiasm through challenges",
      "Builds uplifting support"
    ],
    watchOuts: [
      "May burn out from double output",
      "Could mask issues with positivity",
      "Might exhaust self and others",
      "Risk of unsustainable pace"
    ],
    leverageTips: [
      "Build energizing support systems",
      "Create positive service models",
      "Develop sustainable enthusiasm",
      "Balance energy with rest"
    ]
  },

  "Provider + Teacher": {
    strengths: [
      "Nurtures learning and growth",
      "Provides comprehensive support",
      "Ensures understanding and success",
      "Creates safe learning spaces"
    ],
    watchOuts: [
      "May enable rather than educate",
      "Could lower standards to help",
      "Might create dependent relationships",
      "Risk of burnout from double care"
    ],
    leverageTips: [
      "Build nurturing education",
      "Create supportive learning",
      "Develop care-based teaching",
      "Use providing to enhance education"
    ]
  },

  "Provider + Equalizer": {
    strengths: [
      "Ensures everyone gets fair support",
      "Provides equally to all",
      "Creates balanced care systems",
      "Builds inclusive support"
    ],
    watchOuts: [
      "May spread too thin being fair",
      "Could limit help to ensure equality",
      "Might sacrifice efficiency for fairness",
      "Risk of burnout serving all"
    ],
    leverageTips: [
      "Build fair support systems",
      "Create inclusive service models",
      "Develop balanced care strategies",
      "Use fairness to guide providing"
    ]
  },

  // Equalizer Combinations
  "Equalizer + Pioneer": {
    strengths: [
      "Creates innovations benefiting everyone",
      "Pioneers inclusive solutions",
      "Builds fair access to new opportunities",
      "Develops democratic innovations"
    ],
    watchOuts: [
      "May slow innovation for consensus",
      "Could miss first-mover advantages",
      "Might dilute innovation for fairness",
      "Risk of committee-driven pioneering"
    ],
    leverageTips: [
      "Build inclusive innovation models",
      "Create fair-access platforms",
      "Develop democratic pioneering",
      "Use fairness as innovation driver"
    ]
  },

  "Equalizer + Influencer": {
    strengths: [
      "Champions fairness authentically",
      "Influences toward ethical practices",
      "Builds movements for equality",
      "Creates inclusive platforms"
    ],
    watchOuts: [
      "May alienate privileged audiences",
      "Could limit growth fighting battles",
      "Might attract opposition",
      "Risk of platform becoming political"
    ],
    leverageTips: [
      "Build cause-based influence",
      "Create fair practice movements",
      "Develop inclusive communities",
      "Use influence for positive change"
    ]
  },

  "Equalizer + Creator": {
    strengths: [
      "Builds inherently fair solutions",
      "Creates with all users in mind",
      "Develops inclusive platforms",
      "Ensures equal access to creations"
    ],
    watchOuts: [
      "May overcomplicate for fairness",
      "Could sacrifice efficiency for equality",
      "Might limit features for inclusivity",
      "Risk of slow development"
    ],
    leverageTips: [
      "Build fairness into products",
      "Create inclusive by design",
      "Develop equal-access solutions",
      "Use fairness as differentiator"
    ]
  },

  "Equalizer + Advisor": {
    strengths: [
      "Provides balanced, unbiased counsel",
      "Ensures all perspectives considered",
      "Creates fair strategic frameworks",
      "Builds trust through impartiality"
    ],
    watchOuts: [
      "May overanalyze for perfect fairness",
      "Could delay decisions balancing views",
      "Might frustrate those wanting direction",
      "Risk of being too neutral"
    ],
    leverageTips: [
      "Build mediation services",
      "Create balanced frameworks",
      "Develop fair decision systems",
      "Use impartiality as strength"
    ]
  },

  "Equalizer + Connector": {
    strengths: [
      "Creates balanced, inclusive networks",
      "Ensures equal access to connections",
      "Builds fair relationship ecosystems",
      "Facilitates win-win networking"
    ],
    watchOuts: [
      "May limit network for balance",
      "Could slow connections ensuring fairness",
      "Might overthink relationship dynamics",
      "Risk of missing opportunities"
    ],
    leverageTips: [
      "Build inclusive networks",
      "Create fair connection systems",
      "Develop balanced communities",
      "Use fairness in networking"
    ]
  },

  "Equalizer + Stimulator": {
    strengths: [
      "Energizes movements for fairness",
      "Creates enthusiasm for equality",
      "Builds positive change energy",
      "Maintains drive for justice"
    ],
    watchOuts: [
      "May oversimplify complex issues",
      "Could alienate with zealousness",
      "Might burn out fighting everything",
      "Risk of performative activism"
    ],
    leverageTips: [
      "Build energized movements",
      "Create positive change campaigns",
      "Develop sustainable activism",
      "Use energy for focused impact"
    ]
  },

  "Equalizer + Teacher": {
    strengths: [
      "Creates inclusive education systems",
      "Ensures equal learning access",
      "Builds fair teaching methods",
      "Develops democratic education"
    ],
    watchOuts: [
      "May limit advanced learners",
      "Could slow pace for inclusion",
      "Might overcomplicate for fairness",
      "Risk of lowest denominator"
    ],
    leverageTips: [
      "Build inclusive curricula",
      "Create fair learning systems",
      "Develop equal-opportunity education",
      "Use fairness in teaching"
    ]
  },

  "Equalizer + Provider": {
    strengths: [
      "Ensures fair distribution of support",
      "Provides equally to all needs",
      "Creates balanced care systems",
      "Builds inclusive help networks"
    ],
    watchOuts: [
      "May exhaust resources being fair",
      "Could limit help ensuring equality",
      "Might sacrifice efficiency",
      "Risk of burnout serving all"
    ],
    leverageTips: [
      "Build fair support distribution",
      "Create inclusive care models",
      "Develop balanced help systems",
      "Use fairness to guide support"
    ]
  }
}; 