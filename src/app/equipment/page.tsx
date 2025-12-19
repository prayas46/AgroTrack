
'use client';

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/page-header";
import { EquipmentCard } from "./equipment-card";
import { equipmentData, type Equipment } from "./data";
import { useToast } from "@/hooks/use-toast";

export default function EquipmentPage() {
  const [equipmentList, setEquipmentList] = useState<Equipment[]>(equipmentData);
  const { toast } = useToast();

  useEffect(() => {
    const interval = setInterval(() => {
      setEquipmentList(prevList =>
        prevList.map(equip => {
          if (equip.status === 'maintenance') {
            return equip; // Don't update equipment under maintenance
          }

          // Simulate fuel/battery consumption if active
          let newMetricValue = equip.metric.value;
          if (equip.status === 'active') {
            newMetricValue = Math.max(0, equip.metric.value - Math.random() * 2);
          }
          
          // Simulate slight efficiency changes
          const efficiencyChange = (Math.random() - 0.5) * 1.5;
          const newEfficiency = Math.max(50, Math.min(100, equip.efficiency + efficiencyChange));

          // Randomly change status
          let newStatus: Equipment['status'] = equip.status;
          if (Math.random() < 0.05) {
              if (newStatus === 'active') newStatus = 'idle';
              else if (newStatus === 'idle') newStatus = 'active';
          }
          
          // Check for maintenance state
          if (newMetricValue < 15 || newEfficiency < 60) {
            toast({
              variant: "destructive",
              title: `Maintenance Alert: ${equip.name}`,
              description: `Check ${equip.metric.type} levels and efficiency.`,
            });
            newStatus = 'maintenance';
          }

          return { 
            ...equip, 
            status: newStatus,
            metric: { ...equip.metric, value: parseFloat(newMetricValue.toFixed(1)) },
            efficiency: parseFloat(newEfficiency.toFixed(1)),
          };
        })
      );
    }, 4000); // Update every 4 seconds

    return () => clearInterval(interval);
  }, [toast]);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Equipment Tracking"
        description="Monitor the real-time status and performance of your farm machinery."
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {equipmentList.map((equipment) => (
          <EquipmentCard key={equipment.id} equipment={equipment} />
        ))}
      </div>
    </div>
  );
}
