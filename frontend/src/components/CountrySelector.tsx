import { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import Input from './Input';
import Button from './Button';
import { Card } from './Card';
import { cn } from '../lib/utils';

interface Country {
  code: string;
  name: string;
}

const COUNTRIES: Country[] = [
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'IT', name: 'Italy' },
  { code: 'ES', name: 'Spain' },
  { code: 'JP', name: 'Japan' },
  { code: 'CN', name: 'China' },
  { code: 'IN', name: 'India' },
  { code: 'BR', name: 'Brazil' },
  { code: 'MX', name: 'Mexico' },
  { code: 'RU', name: 'Russia' },
  { code: 'ZA', name: 'South Africa' },
  { code: 'KR', name: 'South Korea' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'SE', name: 'Sweden' },
  { code: 'NO', name: 'Norway' },
  { code: 'DK', name: 'Denmark' },
  { code: 'FI', name: 'Finland' },
  { code: 'PL', name: 'Poland' },
  { code: 'BE', name: 'Belgium' },
  { code: 'CH', name: 'Switzerland' },
  { code: 'AT', name: 'Austria' },
  { code: 'PT', name: 'Portugal' },
  { code: 'GR', name: 'Greece' },
  { code: 'CZ', name: 'Czech Republic' },
  { code: 'IE', name: 'Ireland' },
  { code: 'NZ', name: 'New Zealand' },
  { code: 'SG', name: 'Singapore' },
  { code: 'HK', name: 'Hong Kong' },
  { code: 'TH', name: 'Thailand' },
  { code: 'MY', name: 'Malaysia' },
  { code: 'PH', name: 'Philippines' },
  { code: 'ID', name: 'Indonesia' },
  { code: 'VN', name: 'Vietnam' },
  { code: 'TR', name: 'Turkey' },
  { code: 'SA', name: 'Saudi Arabia' },
  { code: 'AE', name: 'United Arab Emirates' },
  { code: 'IL', name: 'Israel' },
  { code: 'EG', name: 'Egypt' },
  { code: 'NG', name: 'Nigeria' },
  { code: 'KE', name: 'Kenya' },
  { code: 'AR', name: 'Argentina' },
  { code: 'CL', name: 'Chile' },
  { code: 'CO', name: 'Colombia' },
  { code: 'PE', name: 'Peru' },
  { code: 'VE', name: 'Venezuela' },
];

interface CountrySelectorProps {
  selectedCountries: string[];
  onChange: (countries: string[]) => void;
  mode: 'allow' | 'block';
  onModeChange: (mode: 'allow' | 'block') => void;
}

const CountrySelector = ({ selectedCountries, onChange, mode, onModeChange }: CountrySelectorProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCountries = useMemo(() => {
    if (!searchQuery) return COUNTRIES;
    const query = searchQuery.toLowerCase();
    return COUNTRIES.filter(
      (country) =>
        country.name.toLowerCase().includes(query) ||
        country.code.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const toggleCountry = (code: string) => {
    if (selectedCountries.includes(code)) {
      onChange(selectedCountries.filter((c) => c !== code));
    } else {
      onChange([...selectedCountries, code]);
    }
  };

  const selectAll = () => {
    onChange(COUNTRIES.map((c) => c.code));
  };

  const clearAll = () => {
    onChange([]);
  };

  return (
    <div className="space-y-4">
      {/* Mode Selection */}
      <div className="flex items-center space-x-4">
        <label className="text-sm font-medium text-gray-700">Geo-blocking mode:</label>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onModeChange('allow')}
            className={cn(
              'px-4 py-2 rounded-md text-sm font-medium transition-colors',
              mode === 'allow'
                ? 'bg-green-100 text-green-800 border-2 border-green-600'
                : 'bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200'
            )}
          >
            Allow Only
          </button>
          <button
            onClick={() => onModeChange('block')}
            className={cn(
              'px-4 py-2 rounded-md text-sm font-medium transition-colors',
              mode === 'block'
                ? 'bg-red-100 text-red-800 border-2 border-red-600'
                : 'bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200'
            )}
          >
            Block
          </button>
        </div>
      </div>

      <p className="text-sm text-gray-600">
        {mode === 'allow'
          ? 'Only visitors from selected countries can access this link'
          : 'Visitors from selected countries will be blocked'}
      </p>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Search countries..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Bulk Actions */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">
          {selectedCountries.length} selected
        </span>
        <div className="flex space-x-2">
          <Button size="sm" variant="outline" onClick={selectAll}>
            Select All
          </Button>
          <Button size="sm" variant="outline" onClick={clearAll}>
            Clear All
          </Button>
        </div>
      </div>

      {/* Selected Countries */}
      {selectedCountries.length > 0 && (
        <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-md max-h-32 overflow-y-auto">
          {selectedCountries.map((code) => {
            const country = COUNTRIES.find((c) => c.code === code);
            if (!country) return null;
            return (
              <div
                key={code}
                className="flex items-center space-x-1 bg-white px-2 py-1 rounded border border-gray-200"
              >
                <span className="text-sm">{country.name}</span>
                <button
                  onClick={() => toggleCountry(code)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Country List */}
      <Card className="max-h-64 overflow-y-auto">
        <div className="divide-y divide-gray-100">
          {filteredCountries.map((country) => (
            <label
              key={country.code}
              className="flex items-center space-x-3 p-3 hover:bg-gray-50 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedCountries.includes(country.code)}
                onChange={() => toggleCountry(country.code)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-600 border-gray-300 rounded"
              />
              <span className="text-sm font-mono text-gray-600 w-8">{country.code}</span>
              <span className="text-sm text-gray-900">{country.name}</span>
            </label>
          ))}
          {filteredCountries.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              No countries found
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default CountrySelector;
