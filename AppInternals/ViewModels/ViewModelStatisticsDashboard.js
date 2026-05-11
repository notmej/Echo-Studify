import { useEffect,useState} from "react";
import statisticsRepo from "../Repos/StatisticsRepo";

export default function ViewModelStatisticsDashboard() {
    const [selectedPeriod, setSelectedPeriod] = useState("day");
    const [dashboardData, setDashboardData] = useState(null);
    const [isLoadingStatistics, setIsLoadingStatistics] = useState(true);
    const [statisticsError, setStatisticsError] = useState("");

    async function loadStatistics() {
        try {
            setIsLoadingStatistics( true);
            setStatisticsError("");

            const data = await statisticsRepo.getStatisticsDashboardData();
            setDashboardData(data);
        } catch (error) {
            console.log("ViewModelStatisticsDashboard loadStatistics error:",  error);
            setStatisticsError("couldn't load statistics.");
        } finally {
            setIsLoadingStatistics(false);
        }
    }

    function changeSelectedPeriod(period) {
        setSelectedPeriod(period);
    }

    useEffect(() => {
        loadStatistics();
    }, []);

    const selectedPeriodData =
        dashboardData?.periods?.[selectedPeriod] || null;

    return {
    selectedPeriod,
    selectedPeriodData,
    dashboardData,
    isLoadingStatistics,
    statisticsError,
    changeSelectedPeriod,
    refreshStatistics: loadStatistics,
    };
}