
import { motion } from 'framer-motion'
import { Award, Briefcase, Layers, Server, Wrench } from 'lucide-react'
import ryanProfile from '../assets/ryan-ubana.png'
import SlideToDownload from '../components/SlideToDownload.tsx'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
  }
}

const timelineData = [
  {
    year: '2026 – Present',
    role: 'Senior DevOps Engineer (Yourspeak webapp platform)',
    company: 'Supportninja',
    description: [
      'Designed & Scaled Resilient OCI Infrastructure: Built the multi-region, auto-scaling foundation for the YourSpeak social media platform on Oracle Cloud Infrastructure (OCI). Utilized Infrastructure as Code (IaC) to handle unpredictable traffic spikes, designed secure network topologies (VCNs, private subnets, strict security lists), and authored disaster recovery plans to ensure continuous platform availability.',
      'Streamlined Containerized CI/CD & Pipeline Security: Developed end-to-end continuous integration and deployment pipelines using GitHub Repositories and GitHub Actions. Automated Docker container workflows to ship immutable images to registries, integrated automated security scanning directly into pipelines, and established a reliable, zero-downtime microservices release cycle.',
      'Architected Zero-Trust Networks & Vulnerability Governance: Engineered zero-trust network topologies within OCI by isolating critical workloads across private subnets, Virtual Cloud Networks (VCNs), and restrictive security lists. Strengthened the platform\'s security posture by embedding automated vulnerability scanning directly into GitHub deployment pipelines and securely managing sensitive environment variables.',
      'Secured Perimeter Defense & API Traffic Engineering: Deployed and optimized the OCI API Gateway architecture to manage high-throughput traffic for volatile social features like messaging and real-time user feeds. Mitigated systemic abuse and shielded backend microservices from viral spikes by implementing strict rate limiting, robust authentication, and secure CORS policies.',
      'Optimized Traffic Management & Custom Observability: Configured OCI API Gateways to route and secure high-throughput traffic for core social features (user feeds, messaging) via rate limiting, authentication, and CORS policies. Engineered a proprietary, in-house monitoring dashboard and telemetry system to track real-time latencies, successfully cutting production MTTR by 95%.',
      'Engineered Technical Governance & DevOps Runbooks: Created comprehensive system architecture diagrams, OCI disaster recovery strategies, and pipeline documentation in GitHub. This formalized incident response protocols, shifted the engineering team toward an asynchronous, self-service infrastructure model, and significantly streamlined developer onboarding.'
    ],
    project: {
      name: 'Yourspeak webapp platform',
      description: 'Built a multi-region, auto-scaling foundation on OCI using IaC, designed zero-trust network topologies, configured OCI API Gateways with strict rate limiting, and created custom telemetry monitoring dashboards, reducing production MTTR by 95%.'
    },
    icon: Briefcase,
    color: 'theme-border theme-text-primary bg-white/5 dark:bg-white/5 light:bg-black/5'
  },
  {
    year: '2025 – 2026',
    role: 'Technical Project Manager (B2B Ecommerce SAAS Product)',
    company: 'Marketpush & EETech Commerce',
    description: [
      'Orchestrated Agile QA Strategy & Shift-Left Automation: Led the end-to-end QA strategy for the MarketPush B2B e-commerce platform by embedding automated validation early in the SDLC. This stabilized multi-vendor code contributions, accelerated sprint velocity, and ultimately reduced post-release defects by 90% while establishing structured defect triage workflows across cross-functional teams.',
      'Managed Complex Multi-Vendor Roadmaps & E-Commerce Workflows: Aligned phased automation roadmaps with enterprise release trains, managing milestones for critical B2B modules such as multi-supplier catalogs, bulk ordering, net-terms checkout, and tiered pricing. Partnered with Product Owners and external stakeholders to translate complex business logic (like RFQ lifecycles) into actionable technical test cases using BDD frameworks (Cucumber/SpecFlow) within Azure DevOps.',
      'Governed Microservices, CI/CD, & Third-Party Integrations: Spearheaded the integration of scalable automated testing frameworks into Azure DevOps CI/CD pipelines, enforcing continuous execution gates to enable zero-downtime microservices deployments. Mitigated technical risk by overseeing the secure, automated validation of complex ecosystem dependencies, including B2B payment gateways (Stripe, ACH), supplier inventory synchronization, and 3PL APIs.'
    ],
    project: {
      name: 'Marketpush (2025)',
      description: 'Engineered and managed high-throughput, zero-downtime integration pipelines that isolated monolithic payment gateways and real-time inventory systems into microservices. Maintained continuous availability by leveraging production telemetry tracking (SLIs/SLOs) to identify and automatically clear pipeline bottlenecks.'
    },
    icon: Briefcase,
    color: 'theme-border theme-text-primary bg-white/5 dark:bg-white/5 light:bg-black/5'
  },
  {
    year: '2024 – 2025',
    role: 'Open-Source Software Implementation & Automation Specialist (NOTH Project)',
    company: 'Advanced World Solutions',
    description: [
      'High-Throughput Data Syncing: Architected high-data API workflows to automate synchronization between B2B Marketpush platforms and core production databases, removing manual dependencies and processing thousands of concurrent inventory updates with minimal latency.',
      'High-Availability IaC Design: Engineered and validated Terraform (IaC) pipelines comparing Active-Passive failover models with Point-In-Time Restore (PITR) capabilities to guarantee continuous database uptime and zero-data-loss recovery for transaction systems.'
    ],
    project: {
      name: 'NEC - OSS platform (2024)',
      description: 'Designed high-performance API workflows to handle thousands of concurrent inventory and database sync operations with ultra-low latency. Designed and tested infrastructure-as-code (IaC) failover strategies, comparing Active-Passive models against Point-In-Time Restore (PITR) to secure zero-data-loss capabilities for high-stakes transactional data.'
    },
    icon: Server,
    color: 'theme-border theme-text-primary bg-white/5 dark:bg-white/5 light:bg-black/5'
  },
  {
    year: '2023 – 2024',
    role: 'Junior Automation Specialist (Kyocera Inc. Project)',
    company: 'Advanced World Solutions, Inc.',
    description: [
      'Secure Environment Isolation: Configured automated GitHub Actions CI/CD pipelines to build and deploy high-throughput mobile tracking application services, enforcing strict target namespace validation rules to cleanly isolate staging and production environments.',
      'Telemetry Data Engineering: Engineered real-time API workflows capturing mobile device telemetry and optimized automated data collection logic, significantly reducing processing delays for incoming location strings across live environments.'
    ],
    project: {
      name: 'Kyocera (2023)',
      description: 'Implemented automated GitHub Actions CI/CD pipelines configured with strict namespace validation rules to prevent lower-environment configurations from bleeding into live production spaces. Optimized incoming mobile location string data collection logic to speed up telemetry processing across staging and production clusters.'
    },
    icon: Layers,
    color: 'theme-border theme-text-primary bg-white/5 dark:bg-white/5 light:bg-black/5'
  },
  {
    year: '2022 – 2023',
    role: 'Cloud Operations Engineer (RedHat Services)',
    company: 'Advanced World Solutions, Inc. / IBM Japan (Onsite)',
    description: [
      'Enterprise DevOps Delivery: Streamlined project delivery and infrastructure orchestration by implementing robust DevOps pipelines utilizing RedHat OpenShift, Jenkins, SonarQube, and GitLab.',
      'Cloud Security & Compliance: Enforced strict cloud security policies within IBM Cloud and OpenShift environments by executing regular static/dynamic code scans using SonarQube to remediate vulnerabilities before production release.'
    ],
    project: {
      name: 'ROKS - IBM (2022)',
      description: 'Streamlined onsite project delivery by designing containerized DevOps workflows across hybrid cloud environments utilizing RedHat OpenShift, Jenkins, and GitLab. Established secure code deployment baselines by building automated static and dynamic SonarQube quality gates to block vulnerabilities prior to IBM Cloud releases.'
    },
    icon: Wrench,
    color: 'theme-border theme-text-primary bg-white/5 dark:bg-white/5 light:bg-black/5'
  },
  {
    year: '2019 – 2022',
    role: 'Junior Software Engineer (AIP Plus System)',
    company: 'Accenture',
    description: [
      'Environment Automation: Enhanced deployment efficiency and consistency by automating software releases across multiple testing and production environments using a diverse array of DevOps tools and cloud services.',
      'Systems Administration & Scripting: Developed production-grade Linux Bash scripts to streamline system health checks, automate routine server administration tasks, and significantly reduce manual engineering intervention.',
      'Vulnerability Management: Maintained platform security compliance by managing and patching critical vulnerabilities across enterprise Windows and Linux (RHEL, CentOS, Ubuntu) server clusters.'
    ],
    project: {
      name: 'AIP Plus + Spark (2019)',
      description: 'Developed a suite of production-grade Linux Bash scripts that eliminated manual intervention by automating routine server health checks and multi-component software deployments. Controlled and remediated infrastructure security threats by managing patch deployments across cross-platform enterprise environments running Windows Server, RHEL, CentOS, and Ubuntu.'
    },
    icon: Briefcase,
    color: 'theme-border theme-text-primary bg-white/5 dark:bg-white/5 light:bg-black/5'
  }
]

const skillGroups = [
  {
    category: 'Containerization & Orchestration',
    skills: ['OpenShift', 'Kubernetes', 'Docker', 'Rancher'],
    icon: Server
  },
  {
    category: 'CI/CD & Automation',
    skills: ['Jenkins', 'GitLab CI', 'GitHub Actions', 'Azure DevOps', 'Zapier', 'ArgoCD', 'n8n'],
    icon: Wrench
  },
  {
    category: 'Infrastructure as Code (IaC)',
    skills: ['Terraform', 'Pulumi'],
    icon: Layers
  },
  {
    category: 'Cloud Platforms',
    skills: ['Azure', 'IBM Cloud', 'Oracle Cloud', 'AWS'],
    icon: Server
  },
  {
    category: 'Operating Systems & Scripting',
    skills: ['Linux (RHEL, CentOS, Ubuntu)', 'BASH Scripting', 'Windows Server'],
    icon: Wrench
  },
  {
    category: 'Quality & Security',
    skills: ['SonarQube (Static/Dynamic Scanning)', 'JFrog Artifactory', 'Vulnerability Remediation & Patching', 'OWASP ZAP', 'Trivy'],
    icon: Award
  },
  {
    category: 'Agile & Operations',
    skills: ['Jira', 'Monday.com', 'Sprint Backlog Management', 'Telemetry Monitoring (SLIs/SLOs)'],
    icon: Briefcase
  }
]

export default function About() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="mx-auto max-w-7xl px-6 py-12 md:px-12 md:py-20"
    >
      {/* Top Profile & Bio Grid */}
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
        {/* Profile Image Frame (left 5 columns) */}
        <motion.div variants={itemVariants} className="lg:col-span-5 flex justify-center lg:justify-start">
          <div className="relative group max-w-[280px] w-full aspect-[3/4] overflow-hidden rounded-3xl border theme-border bg-white/3 dark:bg-white/3 light:bg-black/3 p-2 transition-all duration-500 hover:border-neutral-500/30 shadow-2xl">
            <div className="relative h-full w-full overflow-hidden rounded-2xl bg-black/10">
              <img
                src={ryanProfile}
                alt="Ryan Danielle Ubana"
                className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-80 pointer-events-none" />
            </div>
          </div>
        </motion.div>

        {/* Bio Text (right 7 columns) */}
        <motion.section variants={itemVariants} className="lg:col-span-7 flex flex-col justify-center">
          <h1 className="font-display text-4xl font-extrabold tracking-tight md:text-6xl theme-text-primary">
            ABOUT <span className="text-outline text-outline-hover transition-colors">ME</span>
          </h1>
          <p className="mt-6 font-sans text-sm leading-relaxed theme-text-secondary md:text-base">
            I am a results-driven DevOps Engineer and Automation Specialist with 7+ years of extensive experience in test and production systems optimization and enterprise-scale software delivery.
          </p>
          <p className="mt-4 font-sans text-sm leading-relaxed theme-text-secondary md:text-base">
            Expert in modernizing CI/CD lifecycles, architecting secure, high-availability cloud infrastructure, and managing containerized environments (Kubernetes/OpenShift).
          </p>
        </motion.section>
      </div>

      {/* Grid: Timeline and Skills */}
      <div className="mt-20 grid grid-cols-1 gap-12 lg:grid-cols-2">
        
        {/* Timeline Column */}
        <motion.section variants={itemVariants}>
          <h2 className="font-display text-[10px] font-bold uppercase tracking-widest theme-text-secondary mb-8">
            Experience Timeline
          </h2>
          
          <div className="relative border-l theme-border pl-6 ml-2 space-y-12">
            {timelineData.map((item, index) => (
              <div key={index} className="relative group">
                {/* Timeline node */}
                <div className={`absolute -left-[37px] top-1 flex h-8 w-8 items-center justify-center rounded-full border ${item.color} transition-all duration-300 group-hover:scale-110`}>
                  <item.icon className="h-4 w-4" />
                </div>
                
                {/* Timeline content */}
                <div>
                  <span className="text-[10px] font-bold theme-text-secondary uppercase tracking-widest">{item.year}</span>
                  <h3 className="font-display text-base font-bold theme-text-primary mt-1 group-hover:theme-text-secondary transition-colors">
                    {item.role}
                  </h3>
                  <h4 className="text-xs font-semibold theme-text-secondary opacity-80 mt-0.5">{item.company}</h4>
                  {Array.isArray(item.description) ? (
                    <ul className="mt-3 list-disc pl-4 space-y-2 text-xs leading-relaxed theme-text-secondary">
                      {item.description.map((bullet, bulletIdx) => (
                        <li key={bulletIdx} className="pl-1">
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-3 text-xs leading-relaxed theme-text-secondary">
                      {item.description}
                    </p>
                  )}
                  {item.project && (
                    <div className="mt-4 rounded-xl border theme-border bg-white/3 dark:bg-white/3 light:bg-black/3 p-4 transition-all duration-300 hover:border-neutral-500/20">
                      <div className="text-[9px] font-bold uppercase tracking-widest text-[#0171E3] dark:text-[#4da3ff] mb-1">Key Project: {item.project.name}</div>
                      <p className="text-[11px] leading-relaxed theme-text-secondary">
                        {item.project.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Skills Column */}
        <motion.section variants={itemVariants} className="flex flex-col gap-10">
          <div>
            <h2 className="font-display text-[10px] font-bold uppercase tracking-widest theme-text-secondary mb-6">
              Core Competencies
            </h2>
            
            <div className="space-y-6">
              {skillGroups.map((group, groupIdx) => (
                <div key={groupIdx} className="rounded-2xl border theme-border bg-white/3 p-6 hover:border-white/10 transition-colors">
                  <h3 className="font-display text-xs font-bold uppercase tracking-widest theme-text-primary mb-4 flex items-center gap-2">
                    <group.icon className="h-4 w-4 theme-text-secondary" />
                    {group.category}
                  </h3>
                  
                  <div className="flex flex-wrap gap-1.5">
                    {group.skills.map((skill, skillIdx) => (
                      <span
                        key={skillIdx}
                        className="rounded-full border theme-border bg-white/5 dark:bg-white/5 light:bg-black/5 px-4 py-1.5 text-[10px] font-bold theme-text-primary transition-all duration-300 dark:hover:bg-white dark:hover:text-black light:hover:bg-black light:hover:text-white dark:hover:border-white light:hover:border-black"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Certifications / Philosophy */}
          <div className="rounded-2xl border theme-border bg-white/3 p-6">
            <h3 className="font-display text-xs font-bold uppercase tracking-widest theme-text-primary mb-2 flex items-center gap-2">
              <Award className="h-4 w-4 theme-text-secondary" />
              Development Philosophy
            </h3>
            <p className="text-[11px] leading-relaxed theme-text-secondary">
              "Clean structures build durable systems." I write code that is modular and document components cleanly. I implement full-cycle CI/CD practices (testing, linting, docker building, remote deployment orchestration) to ensure seamless updates and maximum runtime reliability.
            </p>
            <SlideToDownload 
              pdfUrl="/ryan-danielle-ubana-resume.pdf" 
              fileName="Ryan_Danielle_Ubana_Resume.pdf" 
            />
          </div>
        </motion.section>

      </div>
    </motion.div>
  )
}
