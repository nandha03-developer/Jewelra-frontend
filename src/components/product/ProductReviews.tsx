'use client';

import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/authStore';
import type { Review, ReviewSummary } from '@/types';

interface ProductReviewsProps {
  productId: string;
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [summary, setSummary] = useState<ReviewSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reviewToReport, setReviewToReport] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<'latest' | 'highest' | 'lowest'>('latest');
  
  const { token, user } = useAuthStore();

  const fetchSummary = async () => {
    try {
      const res = await fetch(`/api/reviews/summary?productId=${productId}`);
      const data = await res.json();
      // Ensure we have a valid object with expected properties
      setSummary({
        averageRating: data?.averageRating || 0,
        totalReviews: data?.totalReviews || 0,
        ratingDistribution: data?.ratingDistribution || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      });
    } catch (err) {
      console.error('Failed to fetch summary:', err);
    }
  };

  const fetchReviews = async (pageNum = 1) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/reviews?productId=${productId}&page=${pageNum}&limit=5&sort=${sortBy}`);
      const data = await res.json();
      if (pageNum === 1) {
        setReviews(data.reviews || []);
      } else {
        setReviews(prev => [...prev, ...(data.reviews || [])]);
      }
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
    fetchReviews(1);
  }, [productId, sortBy, token]);

  const handleMarkHelpful = async (reviewId: string) => {
    try {
      const res = await fetch('/api/reviews/helpful', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ reviewId })
      });
      
      if (res.ok) {
        setReviews(prev => prev.map(r => 
          r._id === reviewId ? { ...r, helpfulCount: (r.helpfulCount || 0) + 1 } : r
        ));
        toast.success('Marked as helpful');
      } else if (res.status === 409) {
        toast.info('You have already marked this review as helpful');
      } else {
        toast.error('Unable to process your request at this time');
      }
    } catch (err) {
      console.error('Helpful error:', err);
    }
  };

  return (
    <section id="product-reviews" className="mt-24 lg:mt-32">
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
        {/* Left column: Summary Stats */}
        <div className="lg:w-1/3">
          <div className="sticky top-24">
            <div className="inline-flex items-center gap-2 bg-[#fcf9f6] px-4 py-1.5 rounded-full border border-[#f0e8e0] mb-6">
              <Icon icon="solar:star-ring-bold" className="text-[#D4B996]" width="14" />
              <span className="text-[10px] font-bold text-[#787373] uppercase tracking-widest">Client Reviews</span>
            </div>
            
            <h2 className="text-3xl lg:text-4xl font-serif text-[#2a1310] mb-8">Voices of Luxury</h2>

            {summary && (
              <div className="space-y-8 bg-[#fcf9f6] p-8 rounded-[2.5rem] border border-[#f0e8e0]">
                <div className="flex items-center gap-6">
                  <div className="text-6xl font-serif text-[#751A20]">
                    {(summary.averageRating || 0).toFixed(1)}
                  </div>
                  <div>
                    <div className="flex text-[#D4B996] mb-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Icon 
                          key={s} 
                          icon="mdi:star" 
                          width="20" 
                          className={s > Math.round(summary.averageRating || 0) ? 'opacity-20' : ''} 
                        />
                      ))}
                    </div>
                    <p className="text-xs font-bold text-[#787373] uppercase tracking-widest text-nowrap">
                      Based on {summary.totalReviews || 0} reviews
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {[5, 4, 3, 2, 1].map((rating) => {
                    const count = summary.ratingDistribution?.[rating] || 0;
                    const total = summary.totalReviews || 0;
                    const percentage = total > 0 ? (count / total) * 100 : 0;
                    return (
                      <div key={rating} className="flex items-center gap-4 group">
                        <span className="text-[10px] font-bold text-[#2a1310] w-2">{rating}</span>
                        <div className="flex-1 h-1.5 bg-gray-200/50 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="h-full bg-[#751A20] rounded-full"
                          />
                        </div>
                        <span className="text-[10px] font-bold text-[#787373] w-8 text-right">{Math.round(percentage)}%</span>
                      </div>
                    );
                  })}
                </div>

                <button 
                  onClick={() => {
                    if (!token) {
                      toast.error('Please login to share your experience');
                      // Maybe router.push('/login') here? 
                      return;
                    }
                    setShowForm(true);
                  }}
                  className="w-full py-4 bg-[#751A20] text-white rounded-xl font-bold uppercase tracking-widest text-[11px] hover:bg-[#5a151a] shadow-lg shadow-[#751A20]/10 transition-all active:scale-[0.98]"
                >
                  Write a Review
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right column: Reviews List */}
        <div className="lg:w-2/3">
          <div className="flex items-center justify-between mb-10 pb-6 border-b border-[#f0e8e0]">
            <div className="text-xs font-bold text-[#2a1310] uppercase tracking-widest">
              {reviews.length} Results
            </div>
            <div className="flex items-center gap-4 text-xs font-bold text-[#787373] uppercase tracking-widest">
              <span>Sort By:</span>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-[#2a1310] outline-none cursor-pointer"
              >
                <option value="latest">Latest</option>
                <option value="highest">Highest Rated</option>
                <option value="lowest">Lowest Rated</option>
              </select>
            </div>
          </div>

          <div className="space-y-12">
            {reviews.length > 0 ? (
              reviews.map((review, idx) => (
                <motion.div 
                  key={review._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="group"
                >
                  <div className="flex gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-14 h-14 rounded-full bg-[#fcf9f6] border border-[#f0e8e0] flex items-center justify-center text-[#751A20] font-serif text-xl overflow-hidden relative">
                        {review.userId?.avatar ? (
                          <img src={review.userId.avatar} alt="" className="w-full h-full object-cover" />
                        ) : (
                          review.userId?.name?.charAt(0) || 'A'
                        )}
                        {review.isVerified && (
                          <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm border border-[#f0e8e0]">
                            <Icon icon="lucide:check-circle-2" className="text-green-600" width="14" />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-bold text-[#2a1310] text-sm uppercase tracking-wide">
                            {review.userId?.name || 'Anonymous client'}
                          </h4>
                          <span className="text-[10px] font-bold text-[#D4B996] uppercase tracking-widest">
                            {new Date(review.createdAt).toLocaleDateString('en-US', { 
                              month: 'long', 
                              day: 'numeric', 
                              year: 'numeric' 
                            })}
                          </span>
                        </div>
                        <div className="flex text-[#D4B996]">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Icon key={s} icon="mdi:star" width="16" className={s > review.rating ? 'opacity-20' : ''} />
                          ))}
                        </div>
                      </div>
                      <p className="text-[#787373] leading-relaxed mb-4 italic">
                        "{review.comment}"
                      </p>

                      {review.images && review.images.length > 0 && (
                        <div className="flex gap-2 mb-6">
                          {review.images.map((img, i) => (
                            <div key={i} className="w-16 h-16 rounded-xl overflow-hidden border border-[#f0e8e0]">
                              <img src={img} alt="" className="w-full h-full object-cover" />
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center gap-6">
                        <button 
                          onClick={() => handleMarkHelpful(review._id)}
                          className="flex items-center gap-2 text-[10px] font-bold text-[#2a1310] uppercase tracking-widest hover:text-[#751A20] transition-colors"
                        >
                          <Icon icon="solar:like-linear" width="16" />
                          Helpful ({review.helpfulCount || 0})
                        </button>
                        <button 
                          onClick={() => {
                            if (!token) {
                              toast.error('Please login to report this review');
                              return;
                            }
                            setReviewToReport(review._id);
                            setShowReportModal(true);
                          }}
                          className="flex items-center gap-2 text-[10px] font-bold text-[#787373] uppercase tracking-widest hover:text-[#751A20] transition-colors"
                        >
                          <Icon icon="solar:chat-round-line-linear" width="16" />
                          Report
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : !loading && (
              <div className="text-center py-20 bg-[#fcf9f6] rounded-[2.5rem] border border-dashed border-[#f0e8e0]">
                <Icon icon="solar:chat-round-unread-linear" className="mx-auto text-[#D4B996] mb-4" width="40" />
                <p className="text-sm font-bold text-[#787373] uppercase tracking-widest">No reviews yet. Be the first to share your experience.</p>
              </div>
            )}

            {loading && (
              <div className="space-y-12 animate-pulse">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex gap-6">
                    <div className="w-14 h-14 rounded-full bg-gray-100" />
                    <div className="flex-1 space-y-4">
                      <div className="h-4 bg-gray-100 rounded w-1/4" />
                      <div className="h-20 bg-gray-100 rounded w-full" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-8 flex justify-center">
               <button 
                 onClick={() => {
                   setPage(p => p + 1);
                   fetchReviews(page + 1);
                 }}
                 disabled={loading}
                 className="px-8 py-3 rounded-full border border-[#f0e8e0] text-[10px] font-bold text-[#2a1310] uppercase tracking-[0.2em] hover:bg-[#2a1310] hover:text-white transition-all flex items-center gap-3 group disabled:opacity-50"
               >
                 {loading ? 'Loading...' : 'View More Reviews'}
                 <Icon icon="mdi:chevron-down" className="group-hover:translate-y-0.5 transition-transform" />
               </button>
            </div>
          </div>
        </div>
      </div>

      <ReviewFormModal 
        isOpen={showForm} 
        onClose={() => setShowForm(false)} 
        productId={productId} 
        onSuccess={() => {
          fetchSummary();
          fetchReviews(1);
        }}
      />

      <ReportModal 
        isOpen={showReportModal} 
        onClose={() => {
          setShowReportModal(false);
          setReviewToReport(null);
        }} 
        reviewId={reviewToReport || ''} 
        onSuccess={() => {
          // Success callback if needed
        }}
      />
    </section>
  );
}

function ReportModal({ 
  isOpen, 
  onClose, 
  reviewId, 
  onSuccess 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  reviewId: string;
  onSuccess: () => void;
}) {
  const { token } = useAuthStore();
  const [reason, setReason] = useState('');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const reasons = [
    { value: 'spam', label: 'Spam', icon: 'solar:bug-bold-duotone' },
    { value: 'inappropriate', label: 'Inappropriate', icon: 'solar:forbidden-circle-bold-duotone' },
    { value: 'fake', label: 'Fraudulent', icon: 'solar:shield-warning-bold-duotone' },
    { value: 'harassment', label: 'Harassment', icon: 'solar:user-block-bold-duotone' },
    { value: 'other', label: 'Other Concerns', icon: 'solar:menu-dots-bold-duotone' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason) {
      toast.error('Please select a reason for reporting');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/reviews/report', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ reviewId, reason, comment })
      });
      if (res.ok) {
        toast.success('Your concern has been recorded.');
        onSuccess();
        onClose();
        setReason('');
        setComment('');
      } else {
        throw new Error();
      }
    } catch (err) {
      toast.error('Unable to submit report. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[999] flex items-center justify-center p-4"
            onClick={onClose}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-[#D4B996]/20 relative"
            >
            <div className="relative p-6 md:p-8">
              <button 
                onClick={onClose}
                className="absolute top-6 right-6 text-[#787373] hover:text-[#751A20] transition-colors"
              >
                <Icon icon="mdi:close" width="20" />
              </button>

              <div className="flex items-center gap-4 mb-6 border-b border-[#f0e8e0] pb-6">
                <div className="w-12 h-12 bg-[#fcf9f6] rounded-full border border-[#f0e8e0] flex items-center justify-center text-[#751A20] flex-shrink-0">
                  <Icon icon="solar:shield-warning-bold" width="24" />
                </div>
                <div className="text-left">
                  <h3 className="text-xl font-serif text-[#2a1310]">Report Review</h3>
                  <p className="text-[9px] font-bold text-[#787373] uppercase tracking-widest italic opacity-70">Integrity Check</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="text-[9px] font-bold text-[#787373] uppercase tracking-[0.2em] mb-3 block">Select Reason</label>
                  <div className="grid grid-cols-2 gap-2">
                    {reasons.map((r, idx) => (
                      <button
                        key={r.value}
                        type="button"
                        onClick={() => setReason(r.value)}
                        className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                          reason === r.value 
                            ? 'bg-[#751A20] border-[#751A20] text-white' 
                            : 'bg-[#fcf9f6] border-[#f0e8e0] text-[#2a1310] hover:border-[#D4B996]'
                        } ${idx === reasons.length - 1 && reasons.length % 2 !== 0 ? 'col-span-2' : ''}`}
                      >
                        <Icon icon={r.icon} width="16" className={reason === r.value ? 'text-white' : 'text-[#D4B996]'} />
                        <span className="text-[10px] font-bold uppercase tracking-tight">{r.label}</span>
                        {reason === r.value && (
                          <Icon icon="mdi:check-circle" width="14" className="ml-auto" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[9px] font-bold text-[#787373] uppercase tracking-[0.2em] mb-3 block">Additional Context</label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Details..."
                    rows={2}
                    className="w-full bg-[#fcf9f6] border border-[#f0e8e0] rounded-xl p-3 text-xs text-[#2a1310] focus:outline-none focus:border-[#751A20] transition-all resize-none placeholder:text-[#787373]/50"
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={submitting || !reason}
                    className="w-full h-12 bg-[#751A20] text-white rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-[#5a151a] shadow-lg shadow-[#751A20]/10 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <Icon icon="line-md:loading-twotone-loop" width="18" />
                    ) : (
                      <>
                        Submit Report
                        <Icon icon="solar:flag-bold" width="16" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ReviewFormModal({ 
  isOpen, 
  onClose, 
  productId, 
  onSuccess 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  productId: string;
  onSuccess: () => void;
}) {
  const { token } = useAuthStore();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.length < 10) {
      toast.error('Please share a bit more about your experience (min 10 characters)');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ productId, rating, comment })
      });
      if (res.ok) {
        toast.success('Thank you for your valuable feedback!');
        onSuccess();
        onClose();
        setComment('');
        setRating(5);
      } else if (res.status === 409) {
        toast.warning('You have already reviewed this product');
      } else {
        throw new Error();
      }
    } catch (err) {
      toast.error('Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[999] flex items-center justify-center p-4"
            onClick={onClose}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-xl bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-[#D4B996]/20 relative"
            >
            <div className="relative p-8 md:p-10">
              <button 
                onClick={onClose}
                className="absolute top-8 right-8 text-[#787373] hover:text-[#751A20] transition-colors"
              >
                <Icon icon="mdi:close" width="24" />
              </button>

              <div className="text-center mb-6">
                <div className="w-14 h-14 bg-[#fcf9f6] rounded-full border border-[#f0e8e0] flex items-center justify-center text-[#751A20] mx-auto mb-4">
                  <Icon icon="solar:pen-new-square-bold" width="32" />
                </div>
                <h3 className="text-2xl font-serif text-[#2a1310] mb-2">Share Your Experience</h3>
                <p className="text-xs font-bold text-[#787373] uppercase tracking-widest italic">Help others discover the luxury of Jewelra</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="text-center">
                  <label className="text-[10px] font-bold text-[#787373] uppercase tracking-[0.2em] mb-4 block">Overall Rating</label>
                  <div className="flex items-center justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setRating(s)}
                        onMouseEnter={() => setHoverRating(s)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="transition-all transform hover:scale-110 active:scale-90"
                      >
                        <Icon 
                          icon={s <= (hoverRating || rating) ? "mdi:star" : "mdi:star-outline"} 
                          width="40" 
                          className={s <= (hoverRating || rating) ? 'text-[#D4B996]' : 'text-gray-200'}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-[#787373] uppercase tracking-[0.2em] mb-4 block">Your Thoughts</label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tell us about the craftsmanship, the fit, or the feeling when you wore it..."
                    rows={3}
                    className="w-full bg-[#fcf9f6] border border-[#f0e8e0] rounded-2xl p-5 text-sm text-[#2a1310] focus:outline-none focus:border-[#751A20] focus:ring-1 focus:ring-[#751A20] transition-all resize-none placeholder:text-[#787373]/50"
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full h-14 bg-[#751A20] text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-[#5a151a] shadow-xl shadow-[#751A20]/20 disabled:opacity-50 transition-all flex items-center justify-center gap-3"
                  >
                    {submitting ? (
                      <Icon icon="line-md:loading-twotone-loop" width="20" />
                    ) : (
                      <>
                        Publish Review
                        <Icon icon="solar:arrow-right-bold" width="18" />
                      </>
                    )}
                  </button>
                  <p className="text-center text-[9px] text-[#787373] mt-6 leading-relaxed">
                    By submitting, you agree to our <span className="underline cursor-pointer">Review Policy</span> and certify that this experience is based on your own interaction.
                  </p>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
