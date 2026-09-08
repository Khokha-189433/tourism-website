import { useState, useEffect } from 'react';
import {
  Box, Typography, TextField, Select, MenuItem, FormControl, InputLabel,
  Slider, Button, IconButton, Divider, Drawer, useMediaQuery, useTheme
} from '@mui/material';
import { Close, FilterList } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import API from '../../API/axios';

export default function FiltersSidebar({ filters, onFilterChange, onClose, open }) {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [categories, setCategories] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    fetchCategories();
    fetchDestinations();
  }, []);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const fetchCategories = async () => {
    try {
      const res = await API.get('/categories');
      setCategories(res.data.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchDestinations = async () => {
    try {
      const res = await API.get('/destinations');
      setDestinations(res.data.data);
    } catch (err) {
      console.error('Error fetching destinations:', err);
    }
  };

  const handleChange = (field, value) => {
    setLocalFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleApply = () => {
    onFilterChange(localFilters);
    if (isMobile && onClose) onClose();
  };

  const handleReset = () => {
    const resetFilters = {
      search: '',
      category_id: '',
      destination_id: '',
      min_price: 0,
      max_price: 1000000,
      duration_min: '',
      duration_max: '',
      start_date: '',
      end_date: '',
      sort_by: 'created_at',
      sort_order: 'DESC',
    };
    setLocalFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  const content = (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" fontWeight="bold">
          <FilterList sx={{ mr: 1, verticalAlign: 'middle' }} />
          {t('common.filter')}
        </Typography>
        {isMobile && (
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        )}
      </Box>

      {/* البحث */}
      <TextField
        fullWidth
        label={t('common.search')}
        placeholder={t('trips.searchPlaceholder')}
        value={localFilters.search}
        onChange={(e) => handleChange('search', e.target.value)}
        sx={{ mb: 3 }}
      />

      {/* الفئة */}
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>{t('trips.category')}</InputLabel>
        <Select
          value={localFilters.category_id}
          onChange={(e) => handleChange('category_id', e.target.value)}
          label={t('trips.category')}
        >
          <MenuItem value="">{t('common.all')}</MenuItem>
          {categories.map(cat => (
            <MenuItem key={cat.id} value={cat.id}>
              {cat[`name_${i18n.language === 'en' ? 'en' : 'ar'}`] || cat.name_ar || cat.name_en}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* الوجهة */}
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>{t('trips.destination')}</InputLabel>
        <Select
          value={localFilters.destination_id}
          onChange={(e) => handleChange('destination_id', e.target.value)}
          label={t('trips.destination')}
        >
          <MenuItem value="">{t('common.all')}</MenuItem>
          {destinations.map(dest => (
            <MenuItem key={dest.id} value={dest.id}>
              {dest[`name_${i18n.language === 'en' ? 'en' : 'ar'}`] || dest.name_ar || dest.name_en}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* نطاق السعر */}
      <Typography variant="subtitle2" gutterBottom fontWeight="600">
        {t('trips.priceRange')}
      </Typography>
      <Box sx={{ px: 2, mb: 3 }}>
        <Slider
          value={[localFilters.min_price, localFilters.max_price]}
          onChange={(e, value) => {
            handleChange('min_price', value[0]);
            handleChange('max_price', value[1]);
          }}
          valueLabelDisplay="auto"
          min={0}
          max={1000000}
          step={10000}
          valueLabelFormat={(value) => `${value.toLocaleString()} ${t('common.currency')}`}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
          <Typography variant="caption">
            {localFilters.min_price.toLocaleString()} {t('common.currency')}
          </Typography>
          <Typography variant="caption">
            {localFilters.max_price.toLocaleString()} {t('common.currency')}
          </Typography>
        </Box>
      </Box>

      {/* المدة */}
      <Typography variant="subtitle2" gutterBottom fontWeight="600">
        {t('trips.duration')}
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          label={t('trips.from')}
          type="number"
          value={localFilters.duration_min}
          onChange={(e) => handleChange('duration_min', e.target.value)}
          size="small"
          fullWidth
        />
        <TextField
          label={t('trips.to')}
          type="number"
          value={localFilters.duration_max}
          onChange={(e) => handleChange('duration_max', e.target.value)}
          size="small"
          fullWidth
        />
      </Box>

      {/* التواريخ */}
      <Typography variant="subtitle2" gutterBottom fontWeight="600">
        {t('trips.startDate')}
      </Typography>
      <TextField
        fullWidth
        type="date"
        value={localFilters.start_date}
        onChange={(e) => handleChange('start_date', e.target.value)}
        InputLabelProps={{ shrink: true }}
        sx={{ mb: 2 }}
      />

      <Typography variant="subtitle2" gutterBottom fontWeight="600">
        {t('trips.endDate')}
      </Typography>
      <TextField
        fullWidth
        type="date"
        value={localFilters.end_date}
        onChange={(e) => handleChange('end_date', e.target.value)}
        InputLabelProps={{ shrink: true }}
        sx={{ mb: 3 }}
      />

      <Divider sx={{ my: 3 }} />

      {/* الأزرار */}
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button variant="outlined" onClick={handleReset} fullWidth>
          {t('trips.resetFilters')}
        </Button>
        <Button variant="contained" onClick={handleApply} fullWidth>
          {t('trips.applyFilters')}
        </Button>
      </Box>
    </Box>
  );

  // على الجوال: Drawer
  if (isMobile) {
    return (
      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        sx={{ '& .MuiDrawer-paper': { width: 320 } }}
      >
        {content}
      </Drawer>
    );
  }

  // على الكمبيوتر: Sidebar ثابت
  return (
    <Box sx={{ 
      bgcolor: 'background.paper', 
      borderRadius: 2, 
      boxShadow: 2,
      position: 'sticky',
      top: 80,
      maxHeight: 'calc(100vh - 100px)',
      overflow: 'auto'
    }}>
      {content}
    </Box>
  );
}