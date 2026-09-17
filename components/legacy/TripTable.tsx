'use client';

import { useState } from 'react';
import { Trip } from './types';
import { Search, Edit, Trash2, ChevronLeft, ChevronRight, FileSpreadsheet, MapPin } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface TripTableProps {
  trips: Trip[];
  onEditTrip: (trip: Trip) => void;
  onDeleteTrip: (id: string) => void;
}

export default function TripTable({ trips, onEditTrip, onDeleteTrip }: TripTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter trips based on search query (taxi number, driver name, destination)
  const filteredTrips = trips.filter((trip) => {
    const query = searchQuery.toLowerCase();
    return (
      trip.taxiNumber.toLowerCase().includes(query) ||
      trip.driverName.toLowerCase().includes(query) ||
      trip.destination.toLowerCase().includes(query)
    );
  });

  // Pagination calculations
  const totalItems = filteredTrips.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTrips.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const getStatusBadge = (status: Trip['status']) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'Running':
        return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'Pending':
        return 'bg-blue-50 text-blue-700 border-blue-100';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-full">
      {/* Table Header Controls */}
      <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <h3 className="text-base font-bold text-primary font-heading flex items-center">
          <FileSpreadsheet className="w-5 h-5 text-accent mr-2 shrink-0" />
          <span>Recorded Trips Archive</span>
        </h3>
        
        {/* Search bar */}
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
          <input
            type="text"
            placeholder="Search destination, taxi, driver..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1); // Reset to page 1 on new search
            }}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs transition-all"
          />
        </div>
      </div>

      {/* Table Body Area */}
      <div className="flex-grow overflow-x-auto min-h-[300px]">
        {currentItems.length > 0 ? (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold text-primary uppercase select-none">
                <th className="px-6 py-4">Taxi Number</th>
                <th className="px-6 py-4">Driver</th>
                <th className="px-6 py-4">Route</th>
                <th className="px-6 py-4 text-right">Fare Amount</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm">
              {currentItems.map((trip) => (
                <tr key={trip.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-3.5 font-bold text-primary whitespace-nowrap">
                    {trip.taxiNumber}
                  </td>
                  <td className="px-6 py-3.5 text-text-dark font-medium whitespace-nowrap">
                    {trip.driverName}
                  </td>
                  <td className="px-6 py-3.5 whitespace-nowrap">
                    <span className="inline-flex items-center text-xs text-text-secondary">
                      {trip.from} 
                      <ChevronRight className="w-3 h-3 mx-1 text-accent shrink-0" />
                      <span className="font-bold text-primary flex items-center">
                        <MapPin className="w-3.5 h-3.5 text-accent mr-0.5 shrink-0" />
                        {trip.destination}
                      </span>
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-right font-extrabold text-primary whitespace-nowrap">
                    {formatCurrency(trip.amount)}
                  </td>
                  <td className="px-6 py-3.5 text-text-secondary text-xs whitespace-nowrap">
                    {trip.date}
                  </td>
                  <td className="px-6 py-3.5 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusBadge(trip.status)}`}>
                      {trip.status}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 whitespace-nowrap text-center">
                    <div className="inline-flex items-center justify-center space-x-2">
                      <button
                        onClick={() => onEditTrip(trip)}
                        className="p-1.5 rounded-lg text-primary hover:bg-primary/5 hover:text-primary-hover transition-colors"
                        title="Edit Trip Log"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteTrip(trip.id)}
                        className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors"
                        title="Delete Trip Log"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
            <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 text-slate-400">
              <Search className="w-5 h-5" />
            </div>
            <p className="text-sm font-bold text-primary">No trip records found</p>
            <p className="text-xs text-text-secondary max-w-xs">
              Try adjusting your search criteria or register a new trip using the entry form.
            </p>
          </div>
        )}
      </div>

      {/* Table Pagination Footer */}
      {totalPages > 1 && (
        <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between shrink-0 select-none">
          <p className="text-xs text-text-secondary font-medium">
            Showing <span className="font-bold text-text-dark">{indexOfFirstItem + 1}</span> to{' '}
            <span className="font-bold text-text-dark">{Math.min(indexOfLastItem, totalItems)}</span> of{' '}
            <span className="font-bold text-text-dark">{totalItems}</span> runs
          </p>
          
          <div className="flex items-center space-x-1">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-white disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors ${
                  currentPage === page
                    ? 'bg-primary text-white'
                    : 'border border-slate-200 text-slate-600 hover:bg-white'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-white disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
