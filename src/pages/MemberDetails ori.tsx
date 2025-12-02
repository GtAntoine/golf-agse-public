const handleValidate = async (year: number, validated: boolean) => {
  try {
    const payment = paymentHistory.find(p => p.year === year);
    if (!payment) return;

    const { error } = await supabase
      .from('payment_history')
      .update({ validated })
      .eq('id', payment.id);

    if (error) throw error;

    await fetchData();
  } catch (error) {
    console.error('Error updating validation status:', error);
  }
};