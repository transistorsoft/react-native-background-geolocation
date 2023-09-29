//    Copright (C) 1999-2021, Bernd Gaertner
//    November 12, 2021 
//
//    This program is free software: you can redistribute it and/or modify
//    it under the terms of the GNU General Public License as published by
//    the Free Software Foundation, either version 3 of the License, or
//    (at your option) any later version.

//    This program is distributed in the hope that it will be useful,
//    but WITHOUT ANY WARRANTY; without even the implied warranty of
//    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//    GNU General Public License for more details.

//    You should have received a copy of the GNU General Public License
//    along with this program.  If not, see <http://www.gnu.org/licenses/>.
//
//    Contact:
//    --------
//    Bernd Gaertner
//    Institute of Theoretical Computer Science 
//    ETH Zuerich
//    CAB G31.1
//    CH-8092 Zuerich, Switzerland
//    http://www.inf.ethz.ch/personal/gaertner

#include <cassert>
#include <algorithm>
#include <list>
#include <ctime>
#include <limits>

namespace Miniball {

  // Global Functions
  // ================
  template <typename NT>
  inline NT mb_sqr (NT r) {return r*r;}

  // Functors
  // ========

  // functor to map a point iterator to the corresponding coordinate iterator;
  // generic version for points whose coordinate containers have begin()
  template < typename Pit_, typename Cit_ >
  struct CoordAccessor {
    typedef Pit_                                  Pit;
    typedef Cit_                                  Cit;
    inline  Cit operator() (Pit it) const { return (*it).begin(); }
  };

  // partial specialization for points whose coordinate containers are arrays
  template < typename Pit_, typename Cit_ >
  struct CoordAccessor<Pit_, Cit_*> {
    typedef Pit_                                  Pit;      
    typedef Cit_*                                 Cit;
    inline  Cit operator() (Pit it) const { return *it; }
  };

  // Class Declaration
  // =================

  template <typename CoordAccessor>
  class Miniball {
  private:
    // types
    // The iterator type to go through the input points
    typedef typename CoordAccessor::Pit                         Pit; 
    // The iterator type to go through the coordinates of a single point. 
    typedef typename CoordAccessor::Cit                         Cit; 
    // The coordinate type
    typedef typename std::iterator_traits<Cit>::value_type      NT;  
    // The iterator to go through the support points
    typedef typename std::list<Pit>::iterator                   Sit;

    // data members...
    const int d; // dimension
    Pit points_begin;        
    Pit points_end;          
    CoordAccessor coord_accessor;  
    double time;  
    const NT nt0; // NT(0)                         

    //...for the algorithms
    std::list<Pit> L;                       
    Sit support_end;                        
    int fsize;   // number of forced points                                   
    int ssize;   // number of support points                               

    // ...for the ball updates
    NT* current_c;                         
    NT  current_sqr_r;                      
    NT** c;                                    
    NT* sqr_r;                    
 
    // helper arrays
    NT* q0;
    NT* z;
    NT* f;
    NT** v;
    NT** a;

    // by how much do we allow points outside?
    NT default_tol;

  public:
    // The iterator type to go through the support points
    typedef typename std::list<Pit>::const_iterator SupportPointIterator;
  
    // PRE:  [begin, end) is a nonempty range
    // POST: computes the smallest enclosing ball of the points in the range
    //       [begin, end); the functor a maps a point iterator to an iterator 
    //       through the d coordinates of the point  
    Miniball (int d_, Pit begin, Pit end, CoordAccessor ca = CoordAccessor());

    // POST: returns a pointer to the first element of an array that holds
    //       the d coordinates of the center of the computed ball  
    const NT* center () const;

    // POST: returns the squared radius of the computed ball  
    NT squared_radius () const;
 
    // POST: returns the number of support points of the computed ball;
    //       the support points form a minimal set with the same smallest
    //       enclosing ball as the input set; in particular, the support
    //       points are on the boundary of the computed ball, and their
    //       number is at most d+1 
    int nr_support_points () const;
 
    // POST: returns an iterator to the first support point 
    SupportPointIterator support_points_begin () const;

    // POST: returns a past-the-end iterator for the range of support points  
    SupportPointIterator support_points_end () const;

    // POST: returns the maximum excess of any input point w.r.t. the computed 
    //       ball, divided by the squared radius of the computed ball. The 
    //       excess of a point is the difference between its squared distance
    //       from the center and the squared radius; Ideally, the return value 
    //       is 0. subopt is set to the absolute value of the most negative 
    //       coefficient in the affine combination of the support points that 
    //       yields the center. Ideally, this is a convex combination, and there 
    //       is no negative coefficient in which case subopt is set to 0.  
    NT relative_error (NT& subopt) const;
  
    // POST: return true if the relative error is at most tol, and the
    //       suboptimality is 0; the default tolerance is 10 times the
    //       coordinate type's machine epsilon  
    bool is_valid () const;

    // POST: returns the time in seconds taken by the constructor call for 
    //       computing the smallest enclosing ball  
    double get_time() const;

    // POST: deletes dynamically allocated arrays
    ~Miniball();

  private:  
    void mtf_mb (Sit n);
    void mtf_move_to_front (Sit j);
    void pivot_mb (Pit n);
    void pivot_move_to_front (Pit j);
    NT excess (Pit pit) const;
    void pop ();
    bool push (Pit pit);
    NT suboptimality () const;
    void create_arrays();
    void delete_arrays();
  };

  // Class Definition
  // ================
  template <typename CoordAccessor>
  Miniball<CoordAccessor>::Miniball (int d_, Pit begin, Pit end, 
				     CoordAccessor ca) 
    : d (d_), 
      points_begin (begin), 
      points_end (end), 
      coord_accessor (ca), 
      time (clock()), 
      nt0 (NT(0)), 
      L(), 
      support_end (L.begin()), 
      fsize(0), 
      ssize(0), 
      current_c (NULL), 
      current_sqr_r (NT(-1)),
      c (NULL),
      sqr_r (NULL),
      q0 (NULL),
      z (NULL),
      f (NULL),
      v (NULL),
      a (NULL),
      default_tol (NT(10) * std::numeric_limits<NT>::epsilon())
  {	
    assert (points_begin != points_end);
    create_arrays();

    // set initial center
    for (int j=0; j<d; ++j) c[0][j] = nt0;
    current_c = c[0];

    // compute miniball
    pivot_mb (points_end);

    // update time
    time = (clock() - time) / CLOCKS_PER_SEC;
  }
  
  template <typename CoordAccessor>
  Miniball<CoordAccessor>::~Miniball()
  {
    delete_arrays();
  }

  template <typename CoordAccessor>
  void Miniball<CoordAccessor>::create_arrays() 
  {
    c = new NT*[d+1]; 
    v = new NT*[d+1]; 
    a = new NT*[d+1];
    for (int i=0; i<d+1; ++i) {
      c[i] = new NT[d];
      v[i] = new NT[d];
      a[i] = new NT[d];
    }
    sqr_r = new NT[d+1];
    q0 = new NT[d];
    z = new NT[d+1];
    f = new NT[d+1];
  } 

  template <typename CoordAccessor>
  void Miniball<CoordAccessor>::delete_arrays() 
  {
    delete[] f;
    delete[] z;
    delete[] q0;
    delete[] sqr_r;
    for (int i=0; i<d+1; ++i) {
      delete[] a[i];
      delete[] v[i];
      delete[] c[i];
    }
    delete[] a;
    delete[] v;
    delete[] c;
  }

  template <typename CoordAccessor>
  const typename Miniball<CoordAccessor>::NT* 
  Miniball<CoordAccessor>::center () const 
  {
    return current_c;
  }
 
  template <typename CoordAccessor>
  typename Miniball<CoordAccessor>::NT 
  Miniball<CoordAccessor>::squared_radius () const 
  {
    return current_sqr_r;
  }

  template <typename CoordAccessor>
  int Miniball<CoordAccessor>::nr_support_points () const 
  {
    assert (ssize < d+2);
    return ssize;
  } 

  template <typename CoordAccessor>  
  typename Miniball<CoordAccessor>::SupportPointIterator 
  Miniball<CoordAccessor>::support_points_begin () const 
  {
    return L.begin();
  }

  template <typename CoordAccessor>  
  typename Miniball<CoordAccessor>::SupportPointIterator 
  Miniball<CoordAccessor>::support_points_end () const  
  {
    return support_end;
  }

  template <typename CoordAccessor>  
  typename Miniball<CoordAccessor>::NT 
  Miniball<CoordAccessor>::relative_error (NT& subopt) const 
  {
    NT e, max_e = nt0;
    // compute maximum absolute excess of support points
    for (SupportPointIterator it = support_points_begin(); 
	 it != support_points_end(); ++it) {
      e = excess (*it);
      if (e < nt0) e = -e;
      if (e > max_e) {
	max_e = e; 
      }
    }
    // compute maximum excess of any point
    for (Pit i = points_begin; i != points_end; ++i)
      if ((e = excess (i)) > max_e)
	max_e = e;
   
    subopt = suboptimality();
    assert (current_sqr_r > nt0 || max_e == nt0);
    return (current_sqr_r == nt0 ? nt0 : max_e / current_sqr_r);
  }

  template <typename CoordAccessor>  
  bool Miniball<CoordAccessor>::is_valid () const
  {
    NT suboptimality;
    return ( (relative_error (suboptimality) <= default_tol) && (suboptimality == 0) );
  }

  template <typename CoordAccessor>  
  double Miniball<CoordAccessor>::get_time() const 
  {
    return time;
  }

  template <typename CoordAccessor>  
  void Miniball<CoordAccessor>::mtf_mb (Sit n)
  {
    // Algorithm 1: mtf_mb (L_{n-1}, B), where L_{n-1} = [L.begin, n)  
    // B: the set of forced points, defining the current ball
    // S: the superset of support points computed by the algorithm
    // --------------------------------------------------------------
    // from B. Gaertner, Fast and Robust Smallest Enclosing Balls, ESA 1999,
    // http://www.inf.ethz.ch/personal/gaertner/texts/own_work/esa99_final.pdf  
  
    //   PRE: B = S  
    assert (fsize == ssize);
   
    support_end = L.begin();
    if ((fsize) == d+1) return;  
  
    // incremental construction
    for (Sit i = L.begin(); i != n;) 
      {
	// INV: (support_end - L.begin() == |S|-|B|)
	assert (std::distance (L.begin(), support_end) == ssize - fsize);
       
	Sit j = i++; 
	if (excess(*j) > nt0) 
	  if (push(*j)) {          // B := B + p_i
	    mtf_mb (j);            // mtf_mb (L_{i-1}, B + p_i)
	    pop();                 // B := B - p_i
	    mtf_move_to_front(j);  
	  }
      }
    // POST: the range [L.begin(), support_end) stores the set S\B
  }

  template <typename CoordAccessor>  
  void Miniball<CoordAccessor>::mtf_move_to_front (Sit j) 
  {
    if (support_end == j)
      support_end++;
    L.splice (L.begin(), L, j);
  }

  template <typename CoordAccessor>  
  void Miniball<CoordAccessor>::pivot_mb (Pit n)
  {
    // Algorithm 2: pivot_mb (L_{n-1}), where L_{n-1} = [L.begin, n)  
    // --------------------------------------------------------------
    // from B. Gaertner, Fast and Robust Smallest Enclosing Balls, ESA 1999,
    // http://www.inf.ethz.ch/personal/gaertner/texts/own_work/esa99_final.pdf  
    const NT*   c;
    Pit         pivot, k;
    NT          e, max_e, sqr_r;
    Cit p;
    unsigned int loops_without_progress = 0;
    NT best_sqr_r =  current_sqr_r;
    do {
      sqr_r = current_sqr_r;

      pivot = points_begin;
      max_e = nt0;
      for (k = points_begin; k != n; ++k) {
	    p = coord_accessor(k);
	    e = -sqr_r;
	    c = current_c;
	    for (int j=0; j<d; ++j)
	      e += mb_sqr<NT>(*p++-*c++);
	    if (e > max_e) {
	      max_e = e;
	      pivot = k;
	    }
      }

      if (sqr_r < nt0 || max_e > nt0) {
	    // check if the pivot is already contained in the support set
	    if (std::find(L.begin(), support_end, pivot) == support_end) {
	      assert (fsize == 0);
	      if (push (pivot)) {
	        mtf_mb(support_end);
	        pop();
	        pivot_move_to_front(pivot);
	      }
	    }
      }
      if (best_sqr_r < current_sqr_r) {
	    best_sqr_r =  current_sqr_r;
        loops_without_progress = 0;
      }
      else
        ++loops_without_progress;
    } while (loops_without_progress < 2);
  }

  template <typename CoordAccessor>  
  void Miniball<CoordAccessor>::pivot_move_to_front (Pit j) 
  {
    L.push_front(j);
    if (std::distance(L.begin(), support_end) == d+2)
      support_end--;
  }

  template <typename CoordAccessor>  
  inline typename Miniball<CoordAccessor>::NT 
  Miniball<CoordAccessor>::excess (Pit pit) const 
  {
    Cit p = coord_accessor(pit);
    NT e = -current_sqr_r;
    NT* c = current_c;
    for (int k=0; k<d; ++k){
      e += mb_sqr<NT>(*p++-*c++);
    }
    return e;
  }

  template <typename CoordAccessor>  
  void Miniball<CoordAccessor>::pop ()  
  {
    --fsize;
  }

  template <typename CoordAccessor>  
  bool Miniball<CoordAccessor>::push (Pit pit) 
  {
    int i, j;
    NT eps = mb_sqr<NT>(std::numeric_limits<NT>::epsilon());
   
    Cit cit = coord_accessor(pit);
    Cit p = cit;
 
    if (fsize==0) {
      for (i=0; i<d; ++i)
	    q0[i] = *p++;
      for (i=0; i<d; ++i)
	    c[0][i] = q0[i];
      sqr_r[0] = nt0;
    }
    else {
      // set v_fsize to Q_fsize
      for (i=0; i<d; ++i)
	    //v[fsize][i] = p[i]-q0[i];
	    v[fsize][i] = *p++-q0[i];
      
      // compute the a_{fsize,i}, i< fsize
      for (i=1; i<fsize; ++i) {
	    a[fsize][i] = nt0;
	    for (j=0; j<d; ++j)
	      a[fsize][i] += v[i][j] * v[fsize][j];
	    a[fsize][i]*=(2/z[i]);
      }
      
      // update v_fsize to Q_fsize-\bar{Q}_fsize
      for (i=1; i<fsize; ++i) {
	    for (j=0; j<d; ++j)
	      v[fsize][j] -= a[fsize][i]*v[i][j];
      }
      
      // compute z_fsize
      z[fsize]=nt0;
      for (j=0; j<d; ++j)
	    z[fsize] += mb_sqr<NT>(v[fsize][j]);
      z[fsize]*=2;
      
      // reject push if z_fsize too small
      if (z[fsize]<eps*current_sqr_r) {
	    return false;
      }
      
      // update c, sqr_r
      p=cit;
      NT e = -sqr_r[fsize-1];
      for (i=0; i<d; ++i)
	    e += mb_sqr<NT>(*p++-c[fsize-1][i]);
      f[fsize]=e/z[fsize];
      
      for (i=0; i<d; ++i)
	    c[fsize][i] = c[fsize-1][i]+f[fsize]*v[fsize][i];
      sqr_r[fsize] = sqr_r[fsize-1] + e*f[fsize]/2;
    }
    current_c = c[fsize];
    current_sqr_r = sqr_r[fsize];
    ssize = ++fsize;
    return true;
  }
 
  template <typename CoordAccessor>  
  typename Miniball<CoordAccessor>::NT 
  Miniball<CoordAccessor>::suboptimality () const
  {
    NT* l = new NT[d+1];
    NT min_l = nt0;
    l[0] = NT(1);
    for (int i=ssize-1; i>0; --i) {
      l[i] = f[i];
      for (int k=ssize-1; k>i; --k)
	l[i]-=a[k][i]*l[k];
      if (l[i] < min_l) min_l = l[i];
      l[0] -= l[i];
    }
    if (l[0] < min_l) min_l = l[0];
    delete[] l;
    if (min_l < nt0)
      return -min_l;
    return nt0;
  }

} // end Namespace Miniball
