import { useState } from 'react';
import { Star, ThumbsUp, User } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  content: string;
  helpful: number;
}

interface ProductReviewsProps {
  productId: string;
  productTitle: string;
}

const ProductReviews = ({ productId, productTitle }: ProductReviewsProps) => {
  const { t, language } = useLanguage();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newReview, setNewReview] = useState({
    author: '',
    rating: 5,
    content: '',
  });
  const [hoveredStar, setHoveredStar] = useState(0);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newReview.author.trim() || !newReview.content.trim()) {
      toast.error(t('Please fill all fields', 'يرجى ملء جميع الحقول'));
      return;
    }

    const review: Review = {
      id: Date.now().toString(),
      author: newReview.author,
      rating: newReview.rating,
      date: new Date().toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US'),
      content: newReview.content,
      helpful: 0,
    };

    setReviews([review, ...reviews]);
    setNewReview({ author: '', rating: 5, content: '' });
    setShowForm(false);
    toast.success(t('Review submitted successfully', 'تم إرسال المراجعة بنجاح'));
  };

  const handleHelpful = (reviewId: string) => {
    setReviews(reviews.map(r => 
      r.id === reviewId ? { ...r, helpful: r.helpful + 1 } : r
    ));
  };

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : '0';

  const renderStars = (rating: number, interactive = false, size = 16) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={size}
            className={`transition-colors ${
              star <= (interactive ? hoveredStar || rating : rating)
                ? 'fill-primary text-primary'
                : 'text-muted-foreground/30'
            } ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
            onClick={() => interactive && setNewReview({ ...newReview, rating: star })}
            onMouseEnter={() => interactive && setHoveredStar(star)}
            onMouseLeave={() => interactive && setHoveredStar(0)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="mt-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl text-foreground">
            {t('Customer Reviews', 'آراء العملاء')}
          </h2>
          <div className="flex items-center gap-3 mt-2">
            {renderStars(Math.round(parseFloat(averageRating)))}
            <span className="text-muted-foreground">
              {reviews.length > 0 ? (
                <>
                  {averageRating} {t('out of 5', 'من 5')} ({reviews.length} {reviews.length === 1 ? t('review', 'مراجعة') : t('reviews', 'مراجعات')})
                </>
              ) : (
                t('No reviews yet', 'لا توجد مراجعات بعد')
              )}
            </span>
          </div>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {showForm ? t('Cancel', 'إلغاء') : t('Write a Review', 'اكتب مراجعة')}
        </Button>
      </div>

      {/* Review Form */}
      {showForm && (
        <form 
          onSubmit={handleSubmitReview}
          className="bg-secondary/50 rounded-2xl p-6 space-y-4 animate-fade-in"
        >
          <h3 className="font-medium text-lg">
            {t('Share your thoughts about', 'شاركنا رأيك في')} {productTitle}
          </h3>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              {t('Your Rating', 'تقييمك')}
            </label>
            {renderStars(newReview.rating, true, 24)}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              {t('Your Name', 'اسمك')}
            </label>
            <Input
              value={newReview.author}
              onChange={(e) => setNewReview({ ...newReview, author: e.target.value })}
              placeholder={t('Enter your name', 'أدخل اسمك')}
              className="bg-background"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              {t('Your Review', 'مراجعتك')}
            </label>
            <Textarea
              value={newReview.content}
              onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}
              placeholder={t('Write your review here...', 'اكتب مراجعتك هنا...')}
              className="bg-background min-h-[120px]"
            />
          </div>

          <Button type="submit" className="w-full sm:w-auto">
            {t('Submit Review', 'إرسال المراجعة')}
          </Button>
        </form>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.length === 0 && !showForm ? (
          <div className="text-center py-12 bg-secondary/30 rounded-2xl">
            <User className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">
              {t('Be the first to review this product!', 'كن أول من يراجع هذا المنتج!')}
            </p>
          </div>
        ) : (
          reviews.map((review) => (
            <div 
              key={review.id}
              className="bg-secondary/30 rounded-2xl p-6 space-y-3 animate-fade-in"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <User size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{review.author}</p>
                    <p className="text-sm text-muted-foreground">{review.date}</p>
                  </div>
                </div>
                {renderStars(review.rating)}
              </div>
              
              <p className="text-foreground/90 leading-relaxed">
                {review.content}
              </p>

              <button
                onClick={() => handleHelpful(review.id)}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <ThumbsUp size={14} />
                {t('Helpful', 'مفيد')} ({review.helpful})
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductReviews;
