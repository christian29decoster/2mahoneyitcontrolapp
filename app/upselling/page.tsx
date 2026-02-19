'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/Card'
import { HapticButton } from '@/components/HapticButton'
import { Badge } from '@/components/Badge'
import { Sheet } from '@/components/Sheets'
import { Toast, ToastType } from '@/components/Toasts'
import { UpsellingCard } from '@/components/upselling/UpsellingCard'
import { BundleCard } from '@/components/upselling/BundleCard'
import { useContract } from '@/hooks/useContract'
import { useHaptics } from '@/hooks/useHaptics'
import { useActivityStore } from '@/lib/activity.store'
import { 
  upsellingServices, 
  crossSellingBundles, 
  getPersonalizedRecommendations,
  UpsellingService,
  CrossSellingBundle 
} from '@/lib/upselling'
import { stagger } from '@/lib/ui/motion'
import { TrendingUp, Star, Package, Target } from 'lucide-react'

export default function UpsellingPage() {
  const [selectedService, setSelectedService] = useState<UpsellingService | null>(null)
  const [selectedBundle, setSelectedBundle] = useState<CrossSellingBundle | null>(null)
  const [activeTab, setActiveTab] = useState<'recommendations' | 'services' | 'bundles'>('recommendations')
  const [toasts, setToasts] = useState<Array<{ id: string; type: ToastType; title: string; message?: string }>>([])
  const { contract } = useContract()
  const h = useHaptics()
  const addActivity = useActivityStore((s) => s.addActivity)

  const addToast = (type: ToastType, title: string, message?: string) => {
    const id = Date.now().toString()
    setToasts(prev => [...prev, { id, type, title, message }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 4000)
  }

  const handleServiceSelect = (service: UpsellingService) => {
    h.impact('medium')
    setSelectedService(service)
  }

  const handleBundleSelect = (bundle: CrossSellingBundle) => {
    h.impact('medium')
    setSelectedBundle(bundle)
  }

  const handleAddToContract = () => {
    h.success()
    const name = selectedService?.name ?? selectedBundle?.name
    addActivity({ type: 'added', title: 'Service / Bundle angefragt', message: name })
    addToast('success', 'Service Added', 'Your request has been submitted for approval.')
    setSelectedService(null)
    setSelectedBundle(null)
  }

  const handleTabChange = (tab: 'recommendations' | 'services' | 'bundles') => {
    h.impact('light')
    setActiveTab(tab)
  }

  const currentPlan = contract?.plan.tier || 'Essential'
  const currentServices = contract?.services.map(s => s.key) || []
  const recommendations = getPersonalizedRecommendations(currentPlan, currentServices)

  const filteredServices = upsellingServices.filter(service => 
    service.targetAudience.includes(currentPlan)
  )

  return (
    <>
      <motion.div className="space-y-6" variants={stagger} initial="initial" animate="animate">
        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-bold tracking-tight text-[var(--text)]">
            Enhance Your Security
          </h1>
          <p className="text-[var(--muted)]">
            Discover services tailored to your current plan and security needs
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-2 bg-[var(--surface)]/50 rounded-[16px] p-1">
          <HapticButton
            label="Recommendations"
            onClick={() => handleTabChange('recommendations')}
            variant={activeTab === 'recommendations' ? 'primary' : 'surface'}
            className="flex-1 text-xs"
          />
          <HapticButton
            label="All Services"
            onClick={() => handleTabChange('services')}
            variant={activeTab === 'services' ? 'primary' : 'surface'}
            className="flex-1 text-xs"
          />
          <HapticButton
            label="Bundles"
            onClick={() => handleTabChange('bundles')}
            variant={activeTab === 'bundles' ? 'primary' : 'surface'}
            className="flex-1 text-xs"
          />
        </div>

        {/* Recommendations Tab */}
        {activeTab === 'recommendations' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {recommendations.length > 0 ? (
              recommendations.map((recommendation) => (
                <Card key={recommendation.id}>
                  <div className="flex items-start space-x-3 mb-4">
                    <div className="w-8 h-8 bg-[var(--primary)]/10 rounded-[8px] flex items-center justify-center">
                      <Star className="w-4 h-4 text-[var(--primary)]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-[var(--text)] mb-1">
                        {recommendation.title}
                      </h3>
                      <p className="text-sm text-[var(--muted)] mb-2">
                        {recommendation.description}
                      </p>
                      <Badge variant="secondary" className="text-xs">
                        {recommendation.reason}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {recommendation.services.map((service) => (
                      <UpsellingCard
                        key={service.id}
                        service={service}
                        onSelect={handleServiceSelect}
                        variant="recommended"
                      />
                    ))}
                  </div>
                </Card>
              ))
            ) : (
              <Card>
                <div className="text-center py-8">
                  <Target className="w-12 h-12 text-[var(--muted)] mx-auto mb-4" />
                  <p className="text-[var(--muted)]">No personalized recommendations at this time</p>
                </div>
              </Card>
            )}
          </motion.div>
        )}

        {/* Services Tab */}
        {activeTab === 'services' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {filteredServices.map((service) => (
              <UpsellingCard
                key={service.id}
                service={service}
                onSelect={handleServiceSelect}
                variant={service.discount ? 'limited' : 'default'}
              />
            ))}
          </motion.div>
        )}

        {/* Bundles Tab */}
        {activeTab === 'bundles' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {crossSellingBundles.map((bundle) => (
              <BundleCard
                key={bundle.id}
                bundle={bundle}
                onSelect={handleBundleSelect}
              />
            ))}
          </motion.div>
        )}

        {/* Special Offers Banner */}
        <Card>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-[var(--warning)]/10 rounded-[8px] flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-[var(--warning)]" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-[var(--text)]">Special Offers</h3>
              <p className="text-sm text-[var(--muted)]">
                Limited-time discounts on security services
              </p>
            </div>
            <HapticButton
              label="View Offers"
              onClick={() => setActiveTab('services')}
              variant="surface"
              className="text-xs"
            />
          </div>
        </Card>
      </motion.div>

      {/* Service Details Sheet */}
      <Sheet
        isOpen={!!selectedService}
        onClose={() => setSelectedService(null)}
        title={selectedService?.name || 'Service Details'}
      >
        {selectedService && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-[var(--text)] mb-2">
                {selectedService.name}
              </h3>
              <p className="text-sm text-[var(--muted)] mb-4">
                {selectedService.description}
              </p>
              
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-2xl font-bold text-[var(--text)]">
                    {selectedService.discount 
                      ? `$${(selectedService.price * (1 - selectedService.discount.percentage / 100)).toFixed(0)}`
                      : `$${selectedService.price.toFixed(0)}`
                    }
                  </p>
                  {selectedService.discount && (
                    <p className="text-sm text-[var(--muted)] line-through">
                      ${selectedService.price.toFixed(0)}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm text-[var(--muted)]">{selectedService.duration}</p>
                  {selectedService.discount && (
                    <Badge variant="destructive">
                      -{selectedService.discount.percentage}%
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-[var(--text)] mb-3">Features</h4>
              <div className="space-y-2">
                {selectedService.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-[var(--success)] rounded-full" />
                    <span className="text-sm text-[var(--text)]">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <HapticButton
              label="Add to Contract"
              onClick={handleAddToContract}
              className="w-full"
            />
          </div>
        )}
      </Sheet>

      {/* Bundle Details Sheet */}
      <Sheet
        isOpen={!!selectedBundle}
        onClose={() => setSelectedBundle(null)}
        title={selectedBundle?.name || 'Bundle Details'}
      >
        {selectedBundle && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-[var(--text)] mb-2">
                {selectedBundle.name}
              </h3>
              <p className="text-sm text-[var(--muted)] mb-4">
                {selectedBundle.description}
              </p>
              
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-2xl font-bold text-[var(--text)]">
                    ${selectedBundle.bundlePrice.toFixed(0)}
                  </p>
                  <p className="text-sm text-[var(--muted)] line-through">
                    ${selectedBundle.originalPrice.toFixed(0)}
                  </p>
                </div>
                <div className="text-right">
                  <Badge variant="destructive">
                    Save ${selectedBundle.savings.toFixed(0)}
                  </Badge>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-[var(--text)] mb-3">Included Services</h4>
              <div className="space-y-2">
                {selectedBundle.services.map((serviceId, index) => {
                  const service = upsellingServices.find(s => s.id === serviceId)
                  return service ? (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-[var(--primary)] rounded-full" />
                      <span className="text-sm text-[var(--text)]">{service.name}</span>
                    </div>
                  ) : null
                })}
              </div>
            </div>

            <HapticButton
              label="Get Bundle"
              onClick={handleAddToContract}
              className="w-full"
            />
          </div>
        )}
      </Sheet>

      {/* Toast Manager */}
      <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast
              type={toast.type}
              title={toast.title}
              message={toast.message}
              onClose={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
            />
          </div>
        ))}
      </div>
    </>
  )
}
