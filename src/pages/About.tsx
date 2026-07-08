
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
    year: '2025 – 2026',
    role: 'Automation Specialist (Ecommerce B2B)',
    company: 'Marketpush & EETech Commerce',
    description: 'Owned the end-to-end automation lifecycle for B2B e-commerce platforms, establishing immutable zero-downtime workflows and collaborating to deploy decoupled, microservices-driven payment gateways and customer APIs.',
    project: {
      name: 'Marketpush (2025)',
      description: 'Engineered and managed high-throughput, zero-downtime integration pipelines that isolated monolithic payment gateways and real-time inventory systems into microservices. Maintained continuous availability by leveraging production telemetry tracking (SLIs/SLOs) to identify and automatically clear pipeline bottlenecks.'
    },
    icon: Briefcase,
    color: 'theme-border theme-text-primary bg-white/5 dark:bg-white/5 light:bg-black/5'
  },
  {
    year: '2024 – 2025',
    role: 'OSS Implementation & Automation Specialist (NOTH Project)',
    company: 'Advanced World Solutions',
    description: 'Architected high-data API synchronization workflows between B2B Marketpush and production databases, and designed and validated failover Terraform pipelines.',
    project: {
      name: 'NEC - OSS platform (2024)',
      description: 'Designed high-performance API workflows to handle thousands of concurrent inventory and database sync operations with ultra-low latency. Designed and tested infrastructure-as-code (IaC) failover strategies, comparing Active-Passive models against Point-In-Time Restore (PITR) to secure zero-data-loss capabilities for high-stakes transactional data.'
    },
    icon: Server,
    color: 'theme-border theme-text-primary bg-white/5 dark:bg-white/5 light:bg-black/5'
  },
  {
    year: '2023 – 2024',
    role: 'Junior Automation Specialist (Kyocera Project)',
    company: 'Advanced World Solutions, Inc.',
    description: 'Configured automated GitHub Actions pipelines with strict namespace validation rules for secure staging/production environment isolation, and engineered mobile device telemetry collection workflows.',
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
    company: 'Advanced World Solutions / IBM Japan (Onsite)',
    description: 'Streamlined infrastructure orchestration by implementing robust DevOps pipelines utilizing RedHat OpenShift, Jenkins, SonarQube, and GitLab.',
    project: {
      name: 'ROKS - IBM (2022)',
      description: 'Streamlined onsite project delivery by designing containerized DevOps workflows across hybrid cloud environments utilizing RedHat OpenShift, Jenkins, and GitLab. Established secure code deployment baselines by building automated static and dynamic SonarQube quality gates to block vulnerabilities prior to IBM Cloud releases.'
    },
    icon: Wrench,
    color: 'theme-border theme-text-primary bg-white/5 dark:bg-white/5 light:bg-black/5'
  },
  {
    year: '2019 – 2022',
    role: 'Junior Software Engineer (AIP Plus)',
    company: 'Accenture',
    description: 'Automated software releases across multiple environments, built production-grade Linux Bash scripts for system health and administration, and maintained compliance across Windows and Linux server clusters.',
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
    skills: ['OpenShift', 'Kubernetes', 'Docker'],
    icon: Server
  },
  {
    category: 'CI/CD & Automation',
    skills: ['Jenkins', 'GitLab CI', 'GitHub Actions', 'Azure DevOps', 'Tekton', 'Argo CD', 'n8n', 'Make', 'Zapier'],
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
    skills: ['SonarQube', 'OWASP ZAP', 'Trivy', 'JFrog Artifactory', 'Vulnerability Remediation & Patching'],
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
            ABOUT <span className="text-outline text-outline-hover transition-colors">RYAN UBANA</span>
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
                  <p className="mt-3 text-xs leading-relaxed theme-text-secondary">
                    {item.description}
                  </p>
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
