import { useState } from 'react';
import { MessageCircle, ChevronRight, ChevronLeft, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';

type Country = 'egypt' | 'uae' | 'saudi';
type UserType = 'consumer' | 'salon' | 'trader' | 'distributor' | 'complaints';
type ConsumerOption = 'product' | 'shipping' | 'support';
type ComplaintOption = 'complaint' | 'suggestion';

interface CountryData {
  name: string;
  nameAr: string;
  whatsapp: string;
  regions: string[];
}

const countriesData: Record<Country, CountryData> = {
  egypt: {
    name: 'Egypt',
    nameAr: 'مصر',
    whatsapp: '201100797000',
    regions: [
      'القاهرة', 'الجيزة', 'الإسكندرية', 'الدقهلية', 'البحيرة', 'الشرقية',
      'القليوبية', 'كفر الشيخ', 'الغربية', 'المنوفية', 'دمياط', 'بورسعيد',
      'الإسماعيلية', 'السويس', 'الفيوم', 'بني سويف', 'المنيا', 'أسيوط',
      'سوهاج', 'قنا', 'الأقصر', 'أسوان', 'البحر الأحمر', 'الوادي الجديد',
      'مطروح', 'شمال سيناء', 'جنوب سيناء'
    ]
  },
  uae: {
    name: 'UAE',
    nameAr: 'الإمارات',
    whatsapp: '971506098920',
    regions: [
      'أبوظبي', 'دبي', 'الشارقة', 'عجمان', 'أم القيوين', 'رأس الخيمة', 'الفجيرة'
    ]
  },
  saudi: {
    name: 'Saudi Arabia',
    nameAr: 'السعودية',
    whatsapp: '966500000000', // Placeholder - user needs to provide
    regions: [
      'الرياض', 'مكة المكرمة', 'المدينة المنورة', 'القصيم', 'الشرقية',
      'عسير', 'تبوك', 'حائل', 'الحدود الشمالية', 'جازان', 'نجران', 'الباحة', 'الجوف'
    ]
  }
};

const WhatsAppWidget = () => {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [selectedUserType, setSelectedUserType] = useState<UserType | null>(null);
  const [selectedConsumerOption, setSelectedConsumerOption] = useState<ConsumerOption | null>(null);
  const [selectedComplaintOption, setSelectedComplaintOption] = useState<ComplaintOption | null>(null);
  const [name, setName] = useState('');
  const [region, setRegion] = useState('');
  const [complaintText, setComplaintText] = useState('');

  const resetForm = () => {
    setStep(1);
    setSelectedCountry(null);
    setSelectedUserType(null);
    setSelectedConsumerOption(null);
    setSelectedComplaintOption(null);
    setName('');
    setRegion('');
    setComplaintText('');
  };

  const handleClose = () => {
    setIsOpen(false);
    resetForm();
  };

  const getCountryLabel = () => {
    if (!selectedCountry) return '';
    return language === 'ar' ? countriesData[selectedCountry].nameAr : countriesData[selectedCountry].name;
  };

  const buildWhatsAppMessage = (): string => {
    const countryName = getCountryLabel();
    let message = `🌐 رسالة من الموقع الإلكتروني - BV Cosmatics\n`;
    message += `📍 الدولة: ${countryName}\n`;
    message += `─────────────────\n`;

    switch (selectedUserType) {
      case 'consumer':
        message += `👤 نوع العميل: مستهلك\n`;
        if (selectedConsumerOption === 'product') {
          message += `📦 الاستفسار: أريد الاستفسار عن منتج`;
        } else if (selectedConsumerOption === 'shipping') {
          message += `🚚 الاستفسار: أريد الاستفسار عن طرق الشحن`;
        } else if (selectedConsumerOption === 'support') {
          message += `📞 الاستفسار: أريد التواصل مع خدمة العملاء`;
        }
        break;
      case 'salon':
        message += `💇 نوع العميل: صالون\n`;
        message += `📝 الاسم: ${name}\n`;
        message += `📍 المحافظة/الإمارة: ${region}`;
        break;
      case 'trader':
        message += `🏪 نوع العميل: تاجر\n`;
        message += `📝 الاسم: ${name}\n`;
        message += `📍 المحافظة/الإمارة: ${region}`;
        break;
      case 'distributor':
        message += `🚛 نوع العميل: موزع\n`;
        message += `📝 الاسم: ${name}\n`;
        message += `📍 المحافظة/الإمارة: ${region}`;
        break;
      case 'complaints':
        if (selectedComplaintOption === 'complaint') {
          message += `⚠️ النوع: شكوى\n`;
          message += `📝 التفاصيل: ${complaintText}`;
        } else if (selectedComplaintOption === 'suggestion') {
          message += `💡 النوع: مقترح جديد\n`;
          message += `📝 التفاصيل: ${complaintText}`;
        }
        break;
    }

    return encodeURIComponent(message);
  };

  const openWhatsApp = () => {
    if (!selectedCountry) return;
    const phone = countriesData[selectedCountry].whatsapp;
    const message = buildWhatsAppMessage();
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
    handleClose();
  };

  const canProceedToWhatsApp = (): boolean => {
    if (!selectedUserType) return false;
    
    switch (selectedUserType) {
      case 'consumer':
        return !!selectedConsumerOption;
      case 'salon':
      case 'trader':
      case 'distributor':
        return !!name.trim() && !!region;
      case 'complaints':
        return !!selectedComplaintOption && !!complaintText.trim();
      default:
        return false;
    }
  };

  const renderCountrySelection = () => (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-foreground text-center mb-4">
        اختر الدولة
      </h3>
      <div className="grid gap-3">
        {(Object.keys(countriesData) as Country[]).map((country) => (
          <Button
            key={country}
            variant="outline"
            className="w-full justify-between h-14 text-base bg-background hover:bg-accent"
            onClick={() => {
              setSelectedCountry(country);
              setStep(2);
            }}
          >
            <span>{countriesData[country].nameAr}</span>
            <ChevronLeft className="h-5 w-5" />
          </Button>
        ))}
      </div>
    </div>
  );

  const renderUserTypeSelection = () => (
    <div className="space-y-3">
      <div className="bg-primary/10 rounded-lg p-3 mb-4">
        <p className="text-sm text-primary font-medium text-center">
          📍 الدولة المختارة: {getCountryLabel()}
        </p>
      </div>
      <h3 className="text-lg font-semibold text-foreground text-center mb-4">
        اختر نوع العميل
      </h3>
      <div className="grid gap-3">
        <Button
          variant="outline"
          className="w-full justify-between h-12 bg-background hover:bg-accent"
          onClick={() => { setSelectedUserType('consumer'); setStep(3); }}
        >
          <span>👤 مستهلك</span>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <Button
          variant="outline"
          className="w-full justify-between h-12 bg-background hover:bg-accent"
          onClick={() => { setSelectedUserType('salon'); setStep(3); }}
        >
          <span>💇 صالون</span>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <Button
          variant="outline"
          className="w-full justify-between h-12 bg-background hover:bg-accent"
          onClick={() => { setSelectedUserType('trader'); setStep(3); }}
        >
          <span>🏪 تاجر</span>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <Button
          variant="outline"
          className="w-full justify-between h-12 bg-background hover:bg-accent"
          onClick={() => { setSelectedUserType('distributor'); setStep(3); }}
        >
          <span>🚛 موزع</span>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <Button
          variant="outline"
          className="w-full justify-between h-12 bg-background hover:bg-accent"
          onClick={() => { setSelectedUserType('complaints'); setStep(3); }}
        >
          <span>📝 الشكاوى والمقترحات</span>
          <ChevronLeft className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );

  const renderConsumerOptions = () => (
    <div className="space-y-3">
      <div className="bg-primary/10 rounded-lg p-3 mb-4">
        <p className="text-sm text-primary font-medium text-center">
          📍 الدولة المختارة: {getCountryLabel()}
        </p>
      </div>
      <h3 className="text-lg font-semibold text-foreground text-center mb-4">
        كيف يمكننا مساعدتك؟
      </h3>
      <div className="grid gap-3">
        <Button
          variant={selectedConsumerOption === 'product' ? 'default' : 'outline'}
          className="w-full h-12 bg-background hover:bg-accent"
          onClick={() => setSelectedConsumerOption('product')}
        >
          📦 أريد الاستفسار عن منتج
        </Button>
        <Button
          variant={selectedConsumerOption === 'shipping' ? 'default' : 'outline'}
          className="w-full h-12 bg-background hover:bg-accent"
          onClick={() => setSelectedConsumerOption('shipping')}
        >
          🚚 أريد الاستفسار عن طرق الشحن
        </Button>
        <Button
          variant={selectedConsumerOption === 'support' ? 'default' : 'outline'}
          className="w-full h-12 bg-background hover:bg-accent"
          onClick={() => setSelectedConsumerOption('support')}
        >
          📞 أريد التواصل مع خدمة العملاء
        </Button>
      </div>
    </div>
  );

  const renderBusinessForm = () => {
    const typeLabel = selectedUserType === 'salon' ? 'صالون' : 
                      selectedUserType === 'trader' ? 'تاجر' : 'موزع';
    
    return (
      <div className="space-y-4">
        <div className="bg-primary/10 rounded-lg p-3 mb-4">
          <p className="text-sm text-primary font-medium text-center">
            📍 الدولة المختارة: {getCountryLabel()}
          </p>
        </div>
        <h3 className="text-lg font-semibold text-foreground text-center mb-4">
          بيانات {typeLabel}
        </h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-foreground">الاسم</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={`أدخل اسم ${typeLabel}`}
              className="mt-1 bg-background"
            />
          </div>
          <div>
            <Label htmlFor="region" className="text-foreground">
              {selectedCountry === 'uae' ? 'الإمارة' : 'المحافظة'}
            </Label>
            <Select value={region} onValueChange={setRegion}>
              <SelectTrigger className="mt-1 bg-background">
                <SelectValue placeholder={`اختر ${selectedCountry === 'uae' ? 'الإمارة' : 'المحافظة'}`} />
              </SelectTrigger>
              <SelectContent className="bg-background border z-[100]">
                {selectedCountry && countriesData[selectedCountry].regions.map((r) => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    );
  };

  const renderComplaintsForm = () => (
    <div className="space-y-4">
      <div className="bg-primary/10 rounded-lg p-3 mb-4">
        <p className="text-sm text-primary font-medium text-center">
          📍 الدولة المختارة: {getCountryLabel()}
        </p>
      </div>
      <h3 className="text-lg font-semibold text-foreground text-center mb-4">
        الشكاوى والمقترحات
      </h3>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <Button
          variant={selectedComplaintOption === 'complaint' ? 'default' : 'outline'}
          className="h-12 bg-background hover:bg-accent"
          onClick={() => setSelectedComplaintOption('complaint')}
        >
          ⚠️ شكوى
        </Button>
        <Button
          variant={selectedComplaintOption === 'suggestion' ? 'default' : 'outline'}
          className="h-12 bg-background hover:bg-accent"
          onClick={() => setSelectedComplaintOption('suggestion')}
        >
          💡 مقترح جديد
        </Button>
      </div>
      {selectedComplaintOption && (
        <div>
          <Label htmlFor="complaint" className="text-foreground">
            {selectedComplaintOption === 'complaint' ? 'تفاصيل الشكوى' : 'تفاصيل المقترح'}
          </Label>
          <Input
            id="complaint"
            value={complaintText}
            onChange={(e) => setComplaintText(e.target.value)}
            placeholder={selectedComplaintOption === 'complaint' ? 'اكتب شكواك هنا...' : 'اكتب مقترحك هنا...'}
            className="mt-1 bg-background"
          />
        </div>
      )}
    </div>
  );

  const renderStep3Content = () => {
    switch (selectedUserType) {
      case 'consumer':
        return renderConsumerOptions();
      case 'salon':
      case 'trader':
      case 'distributor':
        return renderBusinessForm();
      case 'complaints':
        return renderComplaintsForm();
      default:
        return null;
    }
  };

  return (
    <>
      {/* Floating WhatsApp Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-50 bg-[#25D366] hover:bg-[#20BD5A] text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
        aria-label="WhatsApp"
      >
        <MessageCircle className="h-7 w-7" />
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleClose}
          />
          <div className="relative bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="sticky top-0 bg-[#25D366] text-white p-4 rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MessageCircle className="h-6 w-6" />
                <span className="font-semibold">تواصل معنا عبر واتساب</span>
              </div>
              <button
                onClick={handleClose}
                className="p-1 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {step === 1 && renderCountrySelection()}
              {step === 2 && renderUserTypeSelection()}
              {step === 3 && renderStep3Content()}
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-card border-t border-border p-4 rounded-b-2xl">
              <div className="flex gap-3">
                {step > 1 && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (step === 3) {
                        setSelectedUserType(null);
                        setSelectedConsumerOption(null);
                        setSelectedComplaintOption(null);
                        setName('');
                        setRegion('');
                        setComplaintText('');
                      }
                      setStep(step - 1);
                    }}
                    className="flex-1"
                  >
                    <ChevronRight className="h-4 w-4 ml-2" />
                    رجوع
                  </Button>
                )}
                {step === 3 && (
                  <Button
                    onClick={openWhatsApp}
                    disabled={!canProceedToWhatsApp()}
                    className="flex-1 bg-[#25D366] hover:bg-[#20BD5A] text-white"
                  >
                    <MessageCircle className="h-4 w-4 ml-2" />
                    فتح واتساب
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WhatsAppWidget;
