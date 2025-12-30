import React, { useState } from 'react';
import { 
  Database, Filter, GitBranch, Cpu, CheckCircle, Settings, 
  Microscope, Sigma, Binary, PlayCircle, Zap, ShieldCheck, 
  BarChart3, BrainCircuit, Terminal, ArrowRight, LineChart
} from 'lucide-react';

const MLPipeline: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);

  const steps = [
    {
      title: "Data Governance & Distributional Audit",
      icon: Database,
      category: "Data Integrity",
      expertise: "Statistical Compliance",
      desc: "Before vectorization, we establish a statistical 'Normal State'. We treat member records as financial legal instruments, auditing the cohort for population drift and feature completeness to ensure the foundation of the model is regulator-ready.",
      techniques: [
        { name: "Descriptive Statistics", logic: "Establishing baseline distribution (μ, σ) for fund-wide liquidity vectors." },
        { name: "KS-Test", logic: "Non-parametric testing to detect covariate shift between historical and live cohorts." }
      ],
      mathIntuition: {
        title: "Distribution Invariance",
        formula: "D_n = \\sup_x | F_{batch}(x) - F_{baseline}(x) |",
        explanation: "By calculating the maximum vertical distance between cumulative distribution functions, we identify 'Data Drift'—preventing model decay caused by subtle changes in member behavior or market conditions."
      },
      tech: ["Pandas", "GreatExpectations", "SciPy"],
      color: "blue"
    },
    {
      title: "Latent Pattern Imputation & Sanitization",
      icon: Filter,
      category: "Preprocessing",
      expertise: "Variance Preservation",
      desc: "Missing data in superannuation isn't random; it's often a signal. We move beyond destructive deletion, using neighborhood analysis to handle missingness while preserving the multi-dimensional variance required for accurate risk profiling.",
      techniques: [
        { name: "KNN Imputation", logic: "Filling missing traits by calculating Euclidean similarity in the feature space." },
        { name: "Winsorization", logic: "Capping account outliers at the 99th percentile to prevent gradient explosion during training." }
      ],
      mathIntuition: {
        title: "Similarity Space Metrics",
        formula: "d(p, q) = \\sqrt{ \\sum_{i=1}^{n} (q_i - p_i)^2 }",
        explanation: "Rather than using simple means, we locate a member in n-dimensional space and impute missing traits based on their 5 most statistically similar peers, maintaining the integrity of the individual's economic profile."
      },
      tech: ["Scikit-Learn", "NumPy", "Cuppy"],
      color: "cyan"
    },
    {
      title: "Economic Feature Ratio Engineering",
      icon: GitBranch,
      category: "Feature Architecture",
      expertise: "Signal Amplification",
      desc: "Static data fields are transformed into dynamic economic indicators. We correct for the Power Law distribution of financial data, amplifying the predictive signal of member loyalty and account utilization.",
      techniques: [
        { name: "Log-Normalization", logic: "Compressing skewed balance distributions to improve tree-split efficiency." },
        { name: "Loyalty Proxies", logic: "Calculating Tenure/Age and Balance/Salary ratios to capture lifecycle-relative commitment." }
      ],
      mathIntuition: {
        title: "Logarithmic Transformation",
        formula: "y = \\ln(1 + x)",
        explanation: "Account balances follow a long-tail distribution. Log-transforming shrinks the scale, allowing the XGBoost loss function to treat a $10k difference in lower balances with the same mathematical weight as a $1M difference in ultra-high tiers."
      },
      tech: ["FeatureTools", "NLTK", "Transformers"],
      color: "teal"
    },
    {
      title: "Non-Linear Gradient Ensemble Modeling",
      icon: Cpu,
      category: "Inference Engine",
      expertise: "Risk Classification",
      desc: "We deploy Gradient Boosted Decision Trees (XGBoost) to capture complex, non-linear member behaviors. The model is specifically tuned to prioritize 'Recall'—ensuring no at-risk AUM goes undetected.",
      techniques: [
        { name: "Weighted Mapping", logic: "Adjusting class weights to handle the imbalance between stayers and churners." },
        { name: "Regularized Objective", logic: "Implementing L1/L2 penalties to ensure the model generalizes across market cycles." }
      ],
      mathIntuition: {
        title: "Objective Function Regularization",
        formula: "Obj(t) = \\sum L(y_i, \\hat{y}_i) + \\Omega(f_t)",
        explanation: "The engine minimizes a combined function of error (L) and complexity (Ω). This prevents 'overfitting'—where a model memorizes a specific member cohort rather than learning the logic of attrition."
      },
      tech: ["XGBoost", "LightGBM", "Joblib"],
      color: "emerald"
    },
    {
      title: "Probabilistic Hyperparameter Search",
      icon: Settings,
      category: "Optimization",
      expertise: "Efficiency Mapping",
      desc: "We replace traditional, compute-heavy Grid Searches with Bayesian Optimization. This maps the model's performance space probabilistically, finding the absolute optimal configuration with 10x less processing time.",
      techniques: [
        { name: "TPE Estimator", logic: "Tree-structured Parzen Estimators for intelligent parameter sampling." },
        { name: "Cross-Validation", logic: "5-fold validation to ensure consistent performance across all member segments." }
      ],
      mathIntuition: {
        title: "Expected Improvement (EI)",
        formula: "EI(x) = E [ \\max(f(x) - f(x^*), 0) ]",
        explanation: "The algorithm builds a surrogate model of performance and only tests parameters that have a high probability of exceeding the current best score, balancing exploration with exploitation."
      },
      tech: ["Hyperopt", "Optuna"],
      color: "green"
    },
    {
      title: "Explainable AI (XAI) & Persona Mapping",
      icon: Microscope,
      category: "Strategy",
      expertise: "Algorithmic Transparency",
      desc: "To move from prediction to action, we use Game Theory to explain WHY risk is occurring. We then project these high-dimensional behaviors into behavioral clusters, allowing for personalized retention strategies.",
      techniques: [
        { name: "SHAP Values", logic: "Fairly attributing churn risk to specific member features." },
        { name: "t-SNE Projection", logic: "Visualizing high-dimensional member clusters in a 2D behavioral manifold." }
      ],
      mathIntuition: {
        title: "Shapley Value Attribution",
        formula: "\\phi_i = \\sum \\frac{|S|!(|F|-|S|-1)!}{|F|!} [v(S \\cup \\{i\}) - v(S)]",
        explanation: "Derived from cooperative Game Theory, we calculate the average marginal contribution of a feature (e.g., Age) across all possible combinations of features, ensuring mathematically fair risk attribution."
      },
      tech: ["SHAP", "K-Means", "Scikit-Learn"],
      color: "indigo"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-20 px-4 md:px-12 font-sans">
      {/* Header */}
      <div className="max-w-5xl mx-auto text-center mb-24">
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white border border-slate-200 text-indigo-600 text-[10px] font-black uppercase tracking-[0.2em] mb-8 shadow-sm">
          <Zap size={14} className="animate-pulse" /> Superannuation Intelligence Pipeline
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter mb-8 leading-[0.85]">
          The Science of <span className="text-indigo-600">Retention.</span>
        </h1>
        <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-3xl mx-auto italic">
          "Establishing institutional trust through rigorous statistical auditing and explainable machine learning architectures."
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Navigation Sidebar */}
        <div className="lg:col-span-4 space-y-3">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6 px-4">Pipeline Architecture</p>
          {steps.map((step, idx) => (
            <button
              key={idx}
              onClick={() => setActiveStep(idx)}
              className={`w-full text-left p-8 rounded-[2.5rem] transition-all border-2 flex items-center gap-6 group ${
                activeStep === idx 
                ? 'bg-slate-900 border-slate-900 shadow-2xl scale-[1.03]' 
                : 'bg-white border-slate-100 hover:border-slate-200'
              }`}
            >
              <div className={`p-4 rounded-2xl ${activeStep === idx ? 'bg-indigo-500 text-white' : 'bg-slate-50 text-slate-400 group-hover:text-indigo-500 transition-colors'}`}>
                <step.icon size={24} />
              </div>
              <div className="flex-1">
                <p className={`text-[9px] font-black uppercase tracking-widest ${activeStep === idx ? 'text-indigo-400' : 'text-slate-400'}`}>
                  Phase 0{idx + 1}
                </p>
                <h3 className={`text-sm font-bold tracking-tight ${activeStep === idx ? 'text-white' : 'text-slate-900'}`}>
                  {step.title}
                </h3>
              </div>
              <ArrowRight size={18} className={`transition-all ${activeStep === idx ? 'text-indigo-500 opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`} />
            </button>
          ))}
        </div>

        {/* Intelligence Detail Panel */}
        <div className="lg:col-span-8 bg-white rounded-[4rem] p-12 md:p-20 border border-slate-100 shadow-xl relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 p-20 text-slate-50 pointer-events-none scale-150 rotate-12">
            <BrainCircuit size={450} />
          </div>

          <div className="relative z-10 animate-in fade-in slide-in-from-right-12 duration-700">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 mb-16">
              <div>
                <span className="px-5 py-2 bg-indigo-50 text-indigo-600 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-indigo-100">
                  {steps[activeStep].category} Framework
                </span>
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter mt-8">
                  {steps[activeStep].title}
                </h2>
              </div>
              <div className="text-right hidden md:block">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Technical Expertise</p>
                <p className="text-xs font-bold text-indigo-600 bg-indigo-50/50 border border-indigo-100 px-4 py-2 rounded-xl inline-block">
                  {steps[activeStep].expertise}
                </p>
              </div>
            </div>

            <p className="text-2xl text-slate-600 font-medium leading-relaxed mb-16 border-l-4 border-indigo-500 pl-10 italic">
              {steps[activeStep].desc}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              {/* Methodology Breakdown */}
              <div className="space-y-10">
                <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] flex items-center gap-3">
                   <Terminal size={18} className="text-indigo-500"/> Logic Implementation
                </h4>
                <div className="space-y-6">
                  {steps[activeStep].techniques.map((tech, i) => (
                    <div key={i} className="group">
                      <p className="text-[15px] font-black text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">{tech.name}</p>
                      <p className="text-[13px] text-slate-500 font-medium leading-relaxed">{tech.logic}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Math Intuition */}
              <div className="space-y-10">
                 <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] flex items-center gap-3">
                   <Sigma size={18} className="text-indigo-500"/> Statistical Intuition
                </h4>
                <div className="bg-slate-900 rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500 rounded-full blur-[100px] opacity-20 -translate-y-1/2 translate-x-1/2" />
                   <p className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.25em] mb-8">{steps[activeStep].mathIntuition.title}</p>
                   <div className="bg-white/5 border border-white/10 p-8 rounded-3xl mb-10 font-mono text-emerald-400 text-sm md:text-lg overflow-x-auto shadow-inner leading-relaxed">
                      {steps[activeStep].mathIntuition.formula}
                   </div>
                   <p className="text-slate-400 text-[13px] leading-relaxed font-medium">
                     {steps[activeStep].mathIntuition.explanation}
                   </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MLPipeline;