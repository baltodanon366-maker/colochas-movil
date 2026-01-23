import { useState, useEffect, useCallback } from 'react';
import { kpisService } from '../services/kpis.service';
import { historialService } from '../../../services/historial.service';
import { KPIVentasHoy, Venta } from '../../../types';
import { format } from 'date-fns';

export const useDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [kpis, setKpis] = useState<KPIVentasHoy | null>(null);
  const [ventasDetalle, setVentasDetalle] = useState<Venta[]>([]);
  const [loadingDetalle, setLoadingDetalle] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const kpisData = await kpisService.getVentasHoy();
      setKpis(kpisData);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const loadVentasDetalle = useCallback(async () => {
    if (loadingDetalle) return;

    setLoadingDetalle(true);
    try {
      const hoy = format(new Date(), 'yyyy-MM-dd');
      const response = await historialService.getVentas({
        fechaInicio: hoy,
        fechaFin: hoy,
        limit: 1000,
      });

      if (response.succeeded && response.data) {
        setVentasDetalle(response.data.data || []);
      }
    } catch (error) {
      console.error('Error loading ventas detalle:', error);
    } finally {
      setLoadingDetalle(false);
    }
  }, [loadingDetalle]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData();
  }, [loadData]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    kpis,
    ventasDetalle,
    loading,
    refreshing,
    loadingDetalle,
    loadVentasDetalle,
    onRefresh,
    reloadData: loadData,
  };
};

